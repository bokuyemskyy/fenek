package dev.fenek.chats.dto;

import java.time.Instant;
import java.util.UUID;

public record UserLastSeenEvent(
                UUID userId, Instant lastSeen) implements UserEvent {
}
