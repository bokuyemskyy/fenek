package dev.fenek.chats.dto;

import java.util.List;

public record MessagePageResponse(
        List<MessageResponse> messages,
        Long nextCursor) {
}
