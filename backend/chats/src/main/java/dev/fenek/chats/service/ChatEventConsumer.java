package dev.fenek.chats.service;

import dev.fenek.chats.config.EventConfig;
import dev.fenek.chats.dto.ChatEvent;
import dev.fenek.chats.dto.WsEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatEventConsumer {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @RabbitListener(queues = EventConfig.QUEUE)
    public void handlePersistentEvent(ChatEvent payload,
            @Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey) {
        handleEvent(payload, routingKey);
    }

    @RabbitListener(queues = EventConfig.REALTIME_QUEUE)
    public void handleRealtimeEvent(
            ChatEvent payload,
            @Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey) {
        handleEvent(payload, routingKey);
    }

    private void handleEvent(ChatEvent payload, String routingKey) {
        Iterable<UUID> recipientIds = chatService.getMemberIds(payload.chatId());

        WsEvent wsEvent = new WsEvent(routingKey, payload);

        for (UUID uid : recipientIds) {
            messagingTemplate.convertAndSendToUser(
                    uid.toString(),
                    "/queue/events",
                    wsEvent);
        }
    }
}