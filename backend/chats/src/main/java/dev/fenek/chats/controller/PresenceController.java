package dev.fenek.chats.controller;

import java.util.UUID;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import dev.fenek.chats.dto.TypingRequest;
import dev.fenek.chats.service.PresenceService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class PresenceController {

    private final PresenceService presenceService;

    @MessageMapping("/typing")
    public void handleTyping(SimpMessageHeaderAccessor headerAccessor, TypingRequest request) {
        UUID userId = (UUID) headerAccessor.getSessionAttributes().get("uid");

        if (userId != null && request.chatId() != null) {
            presenceService.typing(userId, request.chatId());

            presenceService.refreshPresence(userId.toString());
            presenceService.broadcastPresence(userId, true);
        }
    }
}