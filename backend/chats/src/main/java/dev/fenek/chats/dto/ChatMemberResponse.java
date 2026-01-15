package dev.fenek.chats.dto;

import java.util.*;

import dev.fenek.chats.model.ChatMember.Role;

public record ChatMemberResponse(UUID userId, Role role) {
}
