package dev.fenek.users.dto;

import java.time.Instant;
import java.util.UUID;

import lombok.Builder;

@Builder
public record UserResponse(UUID id, String username, String displayName, String color, String avatarUrl,
        Instant lastSeenAt, boolean online) {
}
