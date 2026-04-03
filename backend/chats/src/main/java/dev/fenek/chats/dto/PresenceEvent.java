package dev.fenek.chats.dto;

import java.time.Instant;
import java.util.UUID;

public record PresenceEvent(
                UUID userId, UUID chatId, boolean online, Instant lastSeen) implements ChatEvent {
}