package dev.fenek.chats.dto;

import java.util.UUID;

public record TypingEvent(
                UUID userId, UUID chatId) implements ChatEvent {
}