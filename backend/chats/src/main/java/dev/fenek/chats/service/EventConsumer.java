package dev.fenek.chats.service;

import dev.fenek.chats.config.EventConfig;
import dev.fenek.chats.dto.ChatEvent;
import dev.fenek.chats.dto.UserCreatedEvent;
import dev.fenek.chats.dto.UserEvent;
import dev.fenek.chats.dto.WsEvent;
import dev.fenek.chats.dto.UserUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.UUID;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventConsumer {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @RabbitListener(queues = EventConfig.CHATS_QUEUE)
    public void handlePersistentEvent(ChatEvent payload,
            @Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey) {
        handleEvent(payload, routingKey);
    }

    @RabbitListener(queues = EventConfig.CHATS_REALTIME_QUEUE)
    public void handleRealtimeEvent(
            ChatEvent payload,
            @Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey) {
        handleEvent(payload, routingKey);
    }

    private void handleEvent(ChatEvent payload, String routingKey) {
        String destination = "/topic/chat." + payload.chatId();

        WsEvent event = new WsEvent(routingKey, payload);

        messagingTemplate.convertAndSend(destination, event);
    }

    @RabbitListener(queues = EventConfig.USERS_UPDATED_QUEUE)
    public void handleUserEvent(UserEvent payload,
            @Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey) {
        if (payload instanceof UserUpdatedEvent) {
            UUID userId = payload.userId();

            List<UUID> userChats = chatService.getUserChatIds(userId);
            for (UUID chatId : userChats) {
                String destination = "/topic/chat." + chatId + ".metadata";
                WsEvent event = new WsEvent(routingKey, payload);
                messagingTemplate.convertAndSend(destination, event);
            }
        }
    }

    @RabbitListener(queues = EventConfig.USERS_CREATED_QUEUE)
    public void onUserCreated(UserCreatedEvent event) {
        chatService.createSavedChat(event.userId());
    }
}
