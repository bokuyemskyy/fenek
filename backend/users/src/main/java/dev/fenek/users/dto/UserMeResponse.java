package dev.fenek.users.dto;

import java.util.UUID;

public record UserMeResponse(
                UUID id,
                String email,
                String username,
                String displayName,
                String avatarUrl,
                String color,
                boolean isComplete) {
}