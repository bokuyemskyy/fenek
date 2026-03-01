package dev.fenek.chats.dto;

import java.time.Instant;
import java.util.UUID;

import dev.fenek.chats.model.Message;

public record MessageUpdatedEvent(
        UUID messageId,
        UUID chatId,
        UUID senderId,
        String content,
        Instant createdAt,
        Instant editedAt,
        UUID replyToId) {

    public static MessageUpdatedEvent from(Message message) {
        return new MessageUpdatedEvent(
                message.getId(),
                message.getChat().getId(),
                message.getSenderId(),
                message.getContent(),
                message.getCreatedAt(),
                message.getEditedAt(),
                message.getReplyTo() != null
                        ? message.getReplyTo().getId()
                        : null);
    }
}