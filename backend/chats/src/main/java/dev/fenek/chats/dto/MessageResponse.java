package dev.fenek.chats.dto;

import java.time.Instant;
import java.util.UUID;

public record MessageResponse(
        UUID id,
        UUID senderId,
        String content,
        Instant createdAt,
        Instant editedAt,
        UUID replyToId) {
}