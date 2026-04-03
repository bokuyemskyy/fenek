package dev.fenek.chats.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import dev.fenek.chats.auth.JwtUserPrincipal;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    @Qualifier("clientInboundChannel")
    private final ObjectProvider<MessageChannel> clientInboundChannelProvider;

    private final Map<UUID, Map<String, Map<UUID, String>>> subscriptions = new ConcurrentHashMap<>();

    public void save(UUID userId, String sessionId, UUID chatId, String subId) {
        subscriptions
                .computeIfAbsent(userId, k -> new ConcurrentHashMap<>())
                .computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>())
                .put(chatId, subId);
    }

    public void remove(UUID userId, String sessionId, UUID chatId) {
        Map<String, Map<UUID, String>> sessions = subscriptions.get(userId);
        if (sessions == null)
            return;
        Map<UUID, String> chats = sessions.get(sessionId);
        if (chats == null)
            return;
        chats.remove(chatId);
    }

    public void removeSession(UUID userId, String sessionId) {
        Map<String, Map<UUID, String>> sessions = subscriptions.get(userId);
        if (sessions == null)
            return;
        sessions.remove(sessionId);
        if (sessions.isEmpty()) {
            subscriptions.remove(userId);
        }
    }

    public void kickUserFromChat(UUID userId, UUID chatId) {
        Map<String, Map<UUID, String>> sessions = subscriptions.get(userId);
        if (sessions == null)
            return;

        MessageChannel inboundChannel = clientInboundChannelProvider.getIfAvailable();
        if (inboundChannel == null)
            return;

        for (Map.Entry<String, Map<UUID, String>> sessionEntry : sessions.entrySet()) {
            String sessionId = sessionEntry.getKey();
            String subId = sessionEntry.getValue().get(chatId);
            if (subId == null)
                continue;

            StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.UNSUBSCRIBE);
            accessor.setSubscriptionId(subId);
            accessor.setSessionId(sessionId);
            accessor.setUser(new JwtUserPrincipal(userId));
            Message<byte[]> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());
            inboundChannel.send(message);

            sessionEntry.getValue().remove(chatId);
        }
    }
}