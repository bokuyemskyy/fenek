package dev.fenek.chats.controller;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dev.fenek.chats.auth.JwtUserPrincipal;
import dev.fenek.chats.dto.ChatResponse;
import dev.fenek.chats.dto.CreatePrivateChatRequest;
import dev.fenek.chats.dto.MessagePageResponse;
import dev.fenek.chats.dto.TypingCommand;
import dev.fenek.chats.service.ChatService;
import dev.fenek.chats.service.MessageService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final MessageService messageService;

    @GetMapping
    public List<ChatResponse> getChats(@AuthenticationPrincipal JwtUserPrincipal principal) {
        return chatService.getChats(principal.getUserId());
    }

    @PostMapping("/private")
    public ChatResponse createPrivateChat(@AuthenticationPrincipal JwtUserPrincipal principal,
            @RequestBody CreatePrivateChatRequest request) {
        return chatService.createPrivateChat(principal.getUserId(), request.otherUserId());
    }

    @GetMapping("/{chatId}/messages")
    public MessagePageResponse getMessages(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID chatId,
            @RequestParam(required = false) Long before) {
        return messageService.getMessages(
                principal.getUserId(),
                chatId,
                before != null ? Instant.ofEpochMilli(before) : null);
    }

    @MessageMapping("/typing")
    public void typing(@AuthenticationPrincipal JwtUserPrincipal principal,
            @Payload TypingCommand command) {
        chatService.typing(principal.getUserId(), command.chatId());
    }

    @MessageMapping("/online")
    public void online(@AuthenticationPrincipal JwtUserPrincipal principal) {
        chatService.online(principal.getUserId());
    }
}