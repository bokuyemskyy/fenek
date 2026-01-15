package dev.fenek.chats.dto;

import java.util.List;

public record UserBatchResponse(List<UserResponse> users) {
}
