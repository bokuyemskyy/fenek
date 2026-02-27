package dev.fenek.chats.dto;

import java.util.UUID;

public record TypingEvent(
        UUID chatId,
        UUID userId,
        boolean typing) {
}
