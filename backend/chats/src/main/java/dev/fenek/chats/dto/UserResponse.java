package dev.fenek.chats.dto;

import java.util.UUID;

public record UserResponse(
        UUID id, String username, String displayName, String color, String avatarUrl) {
}
