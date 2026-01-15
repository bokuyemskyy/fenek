package dev.fenek.chats.service;

import dev.fenek.chats.config.ChatEventsConfig;
import dev.fenek.chats.dto.MessageEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatEventConsumer {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @RabbitListener(queues = ChatEventsConfig.QUEUE)
    public void handleChatEvent(MessageEvent payload) {

        log.info("Processing chat event type: {} for chat: {}", payload.type(), payload.chatId());

        Iterable<UUID> recipientIds = chatService.getOtherMemberIds(
                payload.senderId(),
                payload.chatId());

        for (UUID uid : recipientIds) {
            String destinationId = uid.toString();
            log.info("Attempting to send WS to destination user-name: {}", destinationId);
            messagingTemplate.convertAndSendToUser(
                    uid.toString(),
                    "/queue/events",
                    payload);
        }
    }
}