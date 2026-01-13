package dev.fenek.chats.dto;

import java.time.Instant;
import java.util.UUID;

import dev.fenek.chats.model.Message;

public record MessageResponse(
                UUID id,
                UUID senderId,
                String content,
                Instant createdAt,
                Instant editedAt,
                UUID replyToId) {

        public static MessageResponse of(Message message) {
                return new MessageResponse(
                                message.getId(),
                                message.getSenderId(),
                                message.getContent(),
                                message.getCreatedAt(),
                                message.getEditedAt(),
                                message.getReplyTo() != null ? message.getReplyTo().getId() : null);
        }
}