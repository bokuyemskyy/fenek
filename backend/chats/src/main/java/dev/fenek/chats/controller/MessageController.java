package dev.fenek.chats.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import dev.fenek.chats.auth.JwtUserPrincipal;
import dev.fenek.chats.dto.CreateMessageRequest;
import dev.fenek.chats.dto.EditMessageRequest;
import dev.fenek.chats.dto.MessageResponse;
import dev.fenek.chats.model.Message;
import dev.fenek.chats.service.MessageService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

        private final MessageService messageService;

        @PostMapping
        @ResponseStatus(HttpStatus.CREATED)
        public MessageResponse send(
                        @AuthenticationPrincipal JwtUserPrincipal principal,
                        @RequestBody CreateMessageRequest request) {

                Message message = messageService.create(
                                principal.getUserId(),
                                request.chatId(),
                                request.content(),
                                request.replyToId());

                return MessageResponse.of(message);
        }

        @PatchMapping("/{id}")
        public MessageResponse edit(
                        @AuthenticationPrincipal JwtUserPrincipal principal,
                        @PathVariable UUID id,
                        @RequestBody EditMessageRequest request) {

                Message updated = messageService.edit(id, principal.getUserId(), request.content());

                return MessageResponse.of(updated);
        }

        @DeleteMapping("/{id}")
        @ResponseStatus(HttpStatus.NO_CONTENT)
        public void delete(
                        @AuthenticationPrincipal JwtUserPrincipal principal,
                        @PathVariable UUID id) {

                Message deleted = messageService.delete(id, principal.getUserId());

        }

        @PostMapping("/{id}/reactions")
        public void react(
        @PathVariable UUID id,
        @AuthenticationPrincipal JwtUserPrincipal principal,
        @RequestBody ReactionRequest request ) {

        // UUID userId = (UUID) http.getAttribute("uid");

        // messageService.react(id, userId, request.emoji());

        // notifyChatParticipants(
        // request.chatId(),
        // userId,
        // MessageEvent.reactionAdded(id, userId, request.emoji()));
        // }
}
