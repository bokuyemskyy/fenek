package dev.fenek.chats.dto;

public record WsEvent(
        String event,
        ChatEvent data) {
}