package dev.fenek.chats.dto;

import java.util.UUID;

import dev.fenek.chats.model.MessageReaction;

public record ReactionCreatedEvent(
        UUID messageId,
        UUID userId,
        UUID chatId,
        String emoji) implements ChatEvent {

    public static ReactionCreatedEvent from(MessageReaction reaction) {
        return new ReactionCreatedEvent(
                reaction.getMessage().getId(),
                reaction.getUserId(),
                reaction.getMessage().getChat().getId(),
                reaction.getEmoji());
    }
}