package dev.fenek.chats.dto;

import java.time.Instant;
import java.util.UUID;

public record UserCreatedEvent(
                UUID userId,
                String email,
                Instant createdAt) {
}
