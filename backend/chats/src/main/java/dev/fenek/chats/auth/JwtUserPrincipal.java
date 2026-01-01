package dev.fenek.chats.auth;

import java.security.Principal;
import java.util.UUID;

public class JwtUserPrincipal implements Principal {
    private final UUID userId;

    public JwtUserPrincipal(UUID userId) {
        this.userId = userId;
    }

    public UUID getUserId() {
        return userId;
    }

    @Override
    public String getName() {
        return userId.toString();
    }
}