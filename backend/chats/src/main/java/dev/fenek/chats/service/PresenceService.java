package dev.fenek.chats.service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import dev.fenek.chats.config.EventConfig;
import dev.fenek.chats.config.EventConfig.RoutingKeys;
import dev.fenek.chats.dto.PresenceEvent;
import dev.fenek.chats.dto.TypingEvent;
import dev.fenek.chats.dto.UserLastSeenEvent;
import dev.fenek.chats.exception.ChatNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class PresenceService {

    private final StringRedisTemplate redisTemplate;
    private final RabbitTemplate rabbitTemplate;
    private final ChatService chatService;

    private static final String USER_SESSION_COUNT_HASH = "presence:session_counts";
    private static final String USER_PRESENCE_PREFIX = "user:presence:";
    private static final Duration PRESENCE_TTL = Duration.ofMinutes(5);

    @EventListener
    public void handleSessionConnected(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        UUID userId = (UUID) accessor.getSessionAttributes().get("uid");

        if (userId != null) {
            String userIdStr = userId.toString();

            Long newCount = redisTemplate.opsForHash().increment(USER_SESSION_COUNT_HASH, userIdStr, 1);

            refreshPresence(userIdStr);

            if (newCount != null && newCount == 1) {
                broadcastPresence(userId, true);
            }
        }
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        UUID userId = (UUID) accessor.getSessionAttributes().get("uid");

        if (userId != null) {
            String userIdStr = userId.toString();

            Long remainingCount = redisTemplate.opsForHash().increment(USER_SESSION_COUNT_HASH, userIdStr, -1);

            if (remainingCount == null || remainingCount <= 0) {
                redisTemplate.opsForHash().delete(USER_SESSION_COUNT_HASH, userIdStr);
                redisTemplate.delete(USER_PRESENCE_PREFIX + userIdStr);
                broadcastPresence(userId, false);

                Instant lastSeen = Instant.now();
                rabbitTemplate.convertAndSend(EventConfig.USERS_EXCHANGE, RoutingKeys.USER_LAST_SEEN,
                        new UserLastSeenEvent(userId, lastSeen));
            }
        }
    }

    public void refreshPresence(String userIdStr) {
        redisTemplate.opsForValue().set(USER_PRESENCE_PREFIX + userIdStr, "online", PRESENCE_TTL);
    }

    public void typing(UUID userId, UUID chatId) {
        String lockKey = "typing_lock:" + chatId + ":" + userId;

        Boolean canSend = redisTemplate.opsForValue()
                .setIfAbsent(lockKey, "p", Duration.ofSeconds(2));

        if (Boolean.TRUE.equals(canSend)) {
            if (!chatService.isMember(userId, chatId)) {
                throw new ChatNotFoundException();
            }

            rabbitTemplate.convertAndSend(EventConfig.CHATS_REALTIME_EXCHANGE,
                    RoutingKeys.TYPING,
                    new TypingEvent(userId, chatId));
        }
    }

    public void broadcastPresence(UUID userId, boolean online) {
        String routingKey = online ? EventConfig.RoutingKeys.ONLINE
                : EventConfig.RoutingKeys.OFFLINE;
        Instant lastSeen = Instant.now();

        List<UUID> userChats = chatService.getUserChatIds(userId);
        for (UUID chatId : userChats) {
            rabbitTemplate.convertAndSend(EventConfig.CHATS_REALTIME_EXCHANGE,
                    routingKey,
                    new PresenceEvent(userId, chatId, online, lastSeen));
        }
    }

}