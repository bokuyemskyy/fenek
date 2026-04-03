package dev.fenek.users.dto;

import java.util.UUID;

public record UserUpdatedEvent(
        UUID userId) implements UserEvent {
}
