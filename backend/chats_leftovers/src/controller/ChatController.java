package dev.fenek.chats.controller;

import dev.fenek.chats.dto.*;
import dev.fenek.chats.service.ChatService;

import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/test")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> test(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok().build();
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChatResponse> createChat(@AuthenticationPrincipal Jwt jwt,
            @RequestBody ChatCreateRequest request) {
        UUID userId = UUID.fromString(jwt.getSubject());
        ChatResponse response = chatService.createChat(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{chatId}")
    @PreAuthorize("isAuthenticated() && @chatPermissionEvaluator.canAccessChat(#chatId, authentication)")
    public ResponseEntity<ChatResponse> getChat(@PathVariable Long chatId) {
        ChatResponse response = chatService.getChatById(chatId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{chatId}/messages")
    @PreAuthorize("isAuthenticated() && @chatPermissionEvaluator.canAccessChat(#chatId, authentication)")
    public ResponseEntity<List<MessageResponse>> getChatMessages(@PathVariable Long chatId) {
        List<MessageResponse> response = chatService.getChatMessages(chatId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ChatResponse>> getUserChats(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        List<ChatResponse> response = chatService.getUserChats(userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{chatId}")
    @PreAuthorize("isAuthenticated() && @chatPermissionEvaluator.canManageChat(#chatId, authentication)")
    public ResponseEntity<ChatResponse> patchChat(@RequestBody ChatPatchRequest request, @PathVariable Long chatId) {
        ChatResponse response = chatService.patchChatById(chatId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{chatId}")
    @PreAuthorize("isAuthenticated() && @chatPermissionEvaluator.canManageChat(#chatId, authentication)")
    public ResponseEntity<Void> deleteChat(@PathVariable Long chatId) {
        chatService.deleteChat(chatId);
        return ResponseEntity.noContent().build();
    }
}
