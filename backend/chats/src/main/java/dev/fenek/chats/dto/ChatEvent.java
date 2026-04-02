package dev.fenek.chats.dto;

import java.util.UUID;

public interface ChatEvent {
    UUID chatId();

    UUID userId();
}