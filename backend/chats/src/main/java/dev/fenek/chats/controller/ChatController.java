package dev.fenek.chats.controller;

import dev.fenek.chats.dto.*;
import dev.fenek.chats.service.ChatService;

import org.springframework.security.oauth2.jwt.Jwt;
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
    public ResponseEntity<ChatResponse> createChat(@RequestBody ChatCreateRequest request) {
        ChatResponse response = chatService.createChat(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChatResponse> getChat(@PathVariable Long id) {
        ChatResponse response = chatService.getChatById(id);
        return ResponseEntity.ok(response);
    }

    // @GetMapping
    // public ResponseEntity<ChatResponse> getUserChats() {
    // ChatResponse response = chatService.getChatsByUserId(how to take the user id
    // from the authentication bearer);
    // return ResponseEntity.ok(response);
    // }

    // @PatchMapping("/{id}")
    // public ResponseEntity<ChatResponse> patchChat(@RequestBody ???, @PathVariable
    // Long id) {
    // ChatResponse response = chatService.patchChatById()
    // }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteChat(@PathVariable Long id) {
        chatService.deleteChat(id);
        return ResponseEntity.noContent().build();
    }
}
