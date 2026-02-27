package dev.fenek.chats.dto;

import java.util.UUID;

import dev.fenek.chats.model.MessageReaction;

public record ReactionEvent(
        Type type,
        UUID messageId,
        UUID senderId,
        String emoji) {

    public static ReactionEvent deleted(UUID messageId, UUID senderId) {
        return new ReactionEvent(Type.DELETED, messageId, senderId, "");
    }

    public static ReactionEvent created(MessageReaction reaction) {
        return new ReactionEvent(Type.CREATED, reaction.getMessage().getId(), reaction.getUserId(),
                reaction.getEmoji());
    }

    public enum Type {
        CREATED,
        DELETED
    }
}