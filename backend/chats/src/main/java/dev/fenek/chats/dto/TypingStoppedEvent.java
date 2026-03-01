package dev.fenek.chats.dto;

import java.util.UUID;

public record TypingStoppedEvent(
        UUID chatId,
        UUID userId) {
}