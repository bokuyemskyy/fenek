package dev.fenek.users.dto;

public record OAuth2UserInfo(
        String providerId,
        String email,
        String name) {
}