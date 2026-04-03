package dev.fenek.chats.auth;

import java.util.UUID;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import dev.fenek.chats.service.ChatService;
import dev.fenek.chats.service.SubscriptionService;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class StompAuthChannelInterceptor implements ChannelInterceptor {

    private final ChatService chatService;
    private final SubscriptionService subscriptionService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        StompCommand command = accessor.getCommand();

        if (StompCommand.CONNECT.equals(command)) {
            UUID uid = (UUID) accessor.getSessionAttributes().get("uid");
            if (uid != null) {
                accessor.setUser(new JwtUserPrincipal(uid));
            }
        }

        if (StompCommand.SUBSCRIBE.equals(command)) {
            if (accessor.getUser() == null) {
                throw new MessageDeliveryException("Unauthorized");
            }
            String destination = accessor.getDestination();
            if (destination != null && destination.startsWith("/topic/chat.")) {
                String chatIdStr = destination
                        .replace("/topic/chat.", "")
                        .replace(".metadata", "");
                UUID userId = UUID.fromString(accessor.getUser().getName());
                UUID chatId = UUID.fromString(chatIdStr);
                if (!chatService.isMember(userId, chatId)) {
                    throw new MessageDeliveryException("Unauthorized");
                }
                subscriptionService.save(userId, accessor.getSessionId(), chatId, accessor.getSubscriptionId());
            }
        }

        if (StompCommand.UNSUBSCRIBE.equals(command)) {
            if (accessor.getUser() != null) {
                String destination = accessor.getDestination();
                if (destination != null && destination.startsWith("/topic/chat.")) {
                    UUID userId = UUID.fromString(accessor.getUser().getName());
                    UUID chatId = UUID.fromString(destination.replace("/topic/chat.", ""));
                    subscriptionService.remove(userId, accessor.getSessionId(), chatId);
                }
            }
        }

        if (StompCommand.DISCONNECT.equals(command)) {
            if (accessor.getUser() != null) {
                UUID userId = UUID.fromString(accessor.getUser().getName());
                subscriptionService.removeSession(userId, accessor.getSessionId());
            }
        }

        return message;
    }
}