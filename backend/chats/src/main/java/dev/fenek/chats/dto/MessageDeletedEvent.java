package dev.fenek.chats.dto;

import java.time.Instant;
import java.util.UUID;

import dev.fenek.chats.model.Message;

public record MessageDeletedEvent(
        UUID messageId,
        UUID chatId,
        UUID senderId,
        Instant createdAt,
        Instant editedAt,
        UUID replyToId) {

    public static MessageDeletedEvent from(Message message) {
        return new MessageDeletedEvent(
                message.getId(),
                message.getChat().getId(),
                message.getSenderId(),
                message.getCreatedAt(),
                message.getEditedAt(),
                message.getReplyTo() != null
                        ? message.getReplyTo().getId()
                        : null);
    }
}