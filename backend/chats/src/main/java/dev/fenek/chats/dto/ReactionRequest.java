package dev.fenek.chats.dto;

import java.util.UUID;

public record ReactionRequest(UUID messageId, String reaction) {
}
