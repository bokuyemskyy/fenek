package dev.fenek.chats.dto;

import java.util.UUID;

public record MessageCreateRequest(UUID chatId, String content, UUID replyToId) {
}
