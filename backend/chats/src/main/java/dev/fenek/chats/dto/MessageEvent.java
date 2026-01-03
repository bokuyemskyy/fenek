package dev.fenek.chats.dto;

import java.time.Instant;
import java.util.UUID;

import dev.fenek.chats.model.Message;

public record MessageEvent(
        MessageEventType type,
        UUID messageId,
        UUID chatId,
        UUID senderId,
        String content,
        Instant createdAt,
        Instant editedAt,
        UUID replyToId) {

    public static MessageEvent created(Message message) {
        return from(message, MessageEventType.CREATED);
    }

    public static MessageEvent updated(Message message) {
        return from(message, MessageEventType.UPDATED);
    }

    public static MessageEvent deleted(Message message) {
        return new MessageEvent(
                MessageEventType.DELETED,
                message.getId(),
                message.getChat().getId(),
                message.getSenderId(),
                null,
                message.getCreatedAt(),
                message.getEditedAt(),
                message.getReplyTo() != null ? message.getReplyTo().getId() : null);
    }

    private static MessageEvent from(Message message, MessageEventType type) {
        return new MessageEvent(
                type,
                message.getId(),
                message.getChat().getId(),
                message.getSenderId(),
                message.getContent(),
                message.getCreatedAt(),
                message.getEditedAt(),
                message.getReplyTo() != null ? message.getReplyTo().getId() : null);
    }
}