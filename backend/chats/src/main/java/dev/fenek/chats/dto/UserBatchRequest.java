package dev.fenek.chats.dto;

import java.util.List;
import java.util.UUID;

public record UserBatchRequest(UUID requesterId, List<UUID> userIds) {
}
