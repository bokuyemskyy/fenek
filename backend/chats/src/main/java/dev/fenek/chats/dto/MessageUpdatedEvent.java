package dev.fenek.chats.dto;

import java.time.Instant;
import java.util.UUID;

import dev.fenek.chats.model.Message;

public record MessageUpdatedEvent(
        UUID messageId,
        UUID userId,
        UUID chatId,
        String content,
        Instant createdAt,
        Instant editedAt,
        UUID replyToId) implements ChatEvent {

    public static MessageUpdatedEvent from(Message message) {
        return new MessageUpdatedEvent(
                message.getId(),
                message.getSenderId(),
                message.getChat().getId(),
                message.getContent(),
                message.getCreatedAt(),
                message.getEditedAt(),
                message.getReplyTo() != null
                        ? message.getReplyTo().getId()
                        : null);
    }
}