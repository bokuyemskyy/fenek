package dev.fenek.chats.dto;

import java.util.UUID;

public record ReactionDeletedEvent(
        UUID messageId,
        UUID userId,
        UUID chatId) implements ChatEvent {

    public static ReactionDeletedEvent of(UUID messageId, UUID userId, UUID chatId) {
        return new ReactionDeletedEvent(messageId, userId, chatId);
    }
}