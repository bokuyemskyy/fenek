package dev.fenek.users.auth;

public record OAuthUserInfo(
                String providerId,
                String email,
                String name) {
}