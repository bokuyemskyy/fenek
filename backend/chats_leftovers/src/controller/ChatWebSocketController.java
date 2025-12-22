package dev.fenek.chats.controller;

import dev.fenek.chats.dto.MessageResponse;
import dev.fenek.chats.service.ChatService;

import org.springframework.messaging.handler.annotation.MessageMapping;

import java.util.UUID;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.{chatId}.send")
    public void sendMessage(
            @DestinationVariable Long chatId,
            MessageResponse message,
            SimpMessageHeaderAccessor headerAccessor) {

        UUID userId = UUID.fromString(headerAccessor.getUser().getName());

        chatService.saveMessage(message, chatId, userId);

        messagingTemplate.convertAndSend("/topic/chat." + chatId, message);
    }
}
