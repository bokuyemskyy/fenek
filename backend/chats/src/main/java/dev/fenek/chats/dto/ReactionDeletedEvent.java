package dev.fenek.chats.dto;

import java.util.UUID;

public record ReactionDeletedEvent(
        UUID messageId,
        UUID userId) {

    public static ReactionDeletedEvent of(UUID messageId, UUID userId) {
        return new ReactionDeletedEvent(messageId, userId);
    }
}