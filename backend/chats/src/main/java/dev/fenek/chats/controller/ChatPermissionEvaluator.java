package dev.fenek.chats.controller;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import dev.fenek.chats.service.ChatService;

@Component
public class ChatPermissionEvaluator {

    private final ChatService chatService;

    public ChatPermissionEvaluator(ChatService chatService) {
        this.chatService = chatService;
    }

    public boolean canAccessChat(Long chatId, Authentication authentication) {
        UUID userId = UUID.fromString(((Jwt) authentication.getPrincipal()).getSubject());
        return chatService.isUserInChat(chatId, userId);
    }

    public boolean canManageChat(Long chatId, Authentication authentication) {
        UUID userId = UUID.fromString(((Jwt) authentication.getPrincipal()).getSubject());
        return chatService.isUserChatAdmin(chatId, userId);
    }
}
