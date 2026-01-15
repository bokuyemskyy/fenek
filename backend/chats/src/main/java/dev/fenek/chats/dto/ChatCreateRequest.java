package dev.fenek.chats.dto;

import java.util.List;
import java.util.UUID;

public record ChatCreateRequest(
        String title,
        String description,
        boolean isGroup,
        List<UUID> invitedMemberIds) {
}