package dev.fenek.chats.dto;

import java.util.UUID;

public record UserUpdatedEvent(
                UUID userId) implements UserEvent {
}
