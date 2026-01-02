package dev.fenek.chats.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;

import dev.fenek.chats.auth.JwtUserPrincipal;
import dev.fenek.chats.model.Message;
import dev.fenek.chats.service.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final ChatService chatService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MessageDto send(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @RequestBody CreateMessageRequest request,
            ) {

        Message message = messageService.create(
                principal.getUserId(),
                request.chatId(),
                request.content());

        MessageEvent event = MessageEvent.created(message);

        notifyChatParticipants(message.getChatId(), principal.getUserId(), event);

        return MessageDto.from(message);
    }

    @PatchMapping("/{id}")
    public MessageDto edit(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID id,
            @RequestBody EditMessageRequest request) {

        Message updated = messageService.edit(id, principal.getUserId(), request.content());

        notifyChatParticipants(
                updated.getChatId(),
                principal.getUserId(),
                MessageEvent.updated(updated));

        return MessageDto.from(updated);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID id) {

        Message deleted = messageService.delete(id, principal.getUserId());

        notifyChatParticipants(
                deleted.getChatId(),
                principal.getUserId(),
                MessageEvent.deleted(deleted.getId()));
    }

    // @PostMapping("/{id}/reactions")
    // public void react(
    // @PathVariable UUID id,
    // @RequestBody ReactionRequest request,
    // HttpServletRequest http) {

    // UUID userId = (UUID) http.getAttribute("uid");

    // messageService.react(id, userId, request.emoji());

    // notifyChatParticipants(
    // request.chatId(),
    // userId,
    // MessageEvent.reactionAdded(id, userId, request.emoji()));
    // }

    private void notifyChatParticipants(
            UUID chatId,
            UUID senderId,
            Object event) {

        for (UUID uid : chatService.getOtherMemberIds(senderId, chatId)) {
            messagingTemplate.convertAndSendToUser(
                    uid.toString(),
                    "/queue/events",
                    event);
        }
    }
}
