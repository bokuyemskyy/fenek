package dev.fenek.chats.dto;

import java.time.Instant;
import java.util.UUID;

import dev.fenek.chats.model.Message;

public record MessageDeletedEvent(
        UUID messageId,
        UUID userId,
        UUID chatId,
        Instant createdAt,
        Instant editedAt,
        UUID replyToId) implements ChatEvent {

    public static MessageDeletedEvent from(Message message) {
        return new MessageDeletedEvent(
                message.getId(),
                message.getSenderId(),
                message.getChat().getId(),
                message.getCreatedAt(),
                message.getEditedAt(),
                message.getReplyTo() != null
                        ? message.getReplyTo().getId()
                        : null);
    }
}