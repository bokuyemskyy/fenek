package dev.fenek.chats.dto;

import java.util.UUID;

public record TypingStartedEvent(
                UUID chatId,
                UUID userId) {
}