package dev.fenek.chats.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import dev.fenek.chats.auth.JwtUserPrincipal;
import dev.fenek.chats.service.ChatService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class PresenseController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/typing")
    public void typing(@AuthenticationPrincipal JwtUserPrincipal principal,
            @Payload TypingCommand command) {
        UUID userId = principal.getUserId();
        UUID chatId = command.chatId();

        if (!chatService.isMember(chatId, userId)) {
            return;
        }
        TypingEvent event = new TypingEvent(chatId, userId, command.typing());

        for (UUID otherMemberId : chatService.getOtherMemberIds(principal.getUserId(), event.chatId)) {
            messagingTemplate.convertAndSendToUser(otherMemberId.toString(), "/queue/events", event);
        }
    }

    public record TypingCommand(
            UUID chatId,
            boolean typing) {
    }

    public record TypingEvent(
            UUID chatId,
            UUID userId,
            boolean typing) {
    }
}
