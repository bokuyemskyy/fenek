package dev.fenek.chats.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import dev.fenek.chats.auth.JwtUserPrincipal;
import dev.fenek.chats.dto.CreateMessageRequest;
import dev.fenek.chats.dto.EditMessageRequest;
import dev.fenek.chats.dto.MessageResponse;
import dev.fenek.chats.dto.ReactionRequest;
import dev.fenek.chats.dto.TypingCommand;
import dev.fenek.chats.dto.TypingEvent;
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

                messageService.delete(id, principal.getUserId());

        }

        @PostMapping("/{id}/react")
        public void react(
                        @PathVariable UUID id,
                        @AuthenticationPrincipal JwtUserPrincipal principal,
                        @RequestBody ReactionRequest request) {

                messageService.react(id, principal.getUserId(), request.emoji());
        }

        @DeleteMapping("/{id}/react")
        public void unreact(
                        @PathVariable UUID id,
                        @AuthenticationPrincipal JwtUserPrincipal principal) {

                messageService.unreact(id, principal.getUserId());
        }

        @MessageMapping("/typing")
        public void typing(@AuthenticationPrincipal JwtUserPrincipal principal,
                        @Payload TypingCommand command) {

                messageService.typing(principal.getUserId(), command.chatId(), command.typing());
        }
}
