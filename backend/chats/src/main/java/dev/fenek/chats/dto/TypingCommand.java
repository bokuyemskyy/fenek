package dev.fenek.chats.dto;

import java.util.UUID;

public record TypingCommand(
        UUID chatId,
        boolean typing) {
}
