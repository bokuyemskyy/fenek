package dev.fenek.chats.dto;

import java.util.UUID;

public record OnlineEvent(
                UUID userId, UUID chatId) implements ChatEvent {
}