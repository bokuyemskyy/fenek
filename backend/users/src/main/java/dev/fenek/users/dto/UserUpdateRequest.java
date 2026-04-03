package dev.fenek.users.dto;

public record UserUpdateRequest(
        String username,
        String displayName,
        String color,
        Boolean removeAvatar) {
}