package dev.fenek.chats.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.fenek.chats.auth.JwtUserPrincipal;
import dev.fenek.chats.dto.ChatResponse;
import dev.fenek.chats.dto.CreatePrivateChatRequest;
import dev.fenek.chats.service.ChatService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @GetMapping("/")
    public List<ChatResponse> getChats(@AuthenticationPrincipal JwtUserPrincipal principal) {
        return chatService.getChats(principal.getUserId());
    }

    @PostMapping("/private")
    public ChatResponse createPrivateChat(@AuthenticationPrincipal JwtUserPrincipal principal,
            @RequestBody CreatePrivateChatRequest request) {
        return chatService.createPrivateChat(principal.getUserId(), request.getOtherUserId());
    }
}