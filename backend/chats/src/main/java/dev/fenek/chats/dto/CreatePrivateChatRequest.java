package dev.fenek.chats.dto;

import java.util.UUID;

public record CreatePrivateChatRequest(UUID otherUserId) {
}
