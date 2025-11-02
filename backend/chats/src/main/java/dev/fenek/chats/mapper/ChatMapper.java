package dev.fenek.chats.mapper;

import dev.fenek.chats.dto.*;
import dev.fenek.chats.model.*;

import java.util.*;

public class ChatMapper {

    public static Chat toEntity(ChatCreateRequest request) {
        Chat chat = new Chat();
        chat.setTitle(request.getTitle());
        chat.setDescription(request.getDescription());
        chat.setGroup(request.isGroup());
        return chat;
    }

    public static ChatResponse toDto(Chat chat, List<ChatMember> members) {
        ChatResponse dto = new ChatResponse();
        dto.setId(chat.getId());
        dto.setTitle(chat.getTitle());
        dto.setDescription(chat.getDescription());
        dto.setGroup(chat.isGroup());
        dto.setCreatedAt(chat.getCreatedAt());
        dto.setMembers(
                members.stream()
                        .map(m -> new ChatMemberResponse(m.getUserId(), m.getRole().name()))
                        .toList());
        return dto;
    }
}
