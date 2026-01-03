package dev.fenek.chats.dto;

import java.util.UUID;

public record CreateMessageRequest(UUID chatId, String content, UUID replyToId) {
}
