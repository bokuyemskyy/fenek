package dev.fenek.chats.mapper;

import dev.fenek.chats.dto.*;
import dev.fenek.chats.model.*;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class ChatMapper {

    public Chat toEntity(ChatCreateRequest dto) {
        Chat chat = new Chat();
        chat.setTitle(dto.getTitle());
        chat.setDescription(dto.getDescription());
        chat.setGroup(dto.isGroup());
        return chat;
    }

    public ChatResponse toDto(Chat entity, List<ChatMember> members) {
        ChatResponse dto = new ChatResponse();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setGroup(entity.isGroup());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setMembers(
                members.stream()
                        .map(m -> new ChatMemberResponse(m.getUserId(), m.getRole().name()))
                        .toList());
        return dto;
    }
}
