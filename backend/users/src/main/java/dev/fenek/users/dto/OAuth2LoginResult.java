package dev.fenek.users.dto;

import dev.fenek.users.model.User;

public record OAuth2LoginResult(
        User user,
        boolean newlyCreated) {
}