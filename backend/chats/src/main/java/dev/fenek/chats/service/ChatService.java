package dev.fenek.chats.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import dev.fenek.chats.model.Chat;
import dev.fenek.chats.repository.ChatRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;

    public Optional<Chat> createSavedChat(UUID ownerId) {
        if (chatRepository.existsByOwnerIdAndType(ownerId, Chat.Type.SAVED)) {
            return Optional.empty();
        }

        Chat chat = Chat.builder()
                .title("Saved messages")
                .description("This is a safe place. You can send anything you want here.")
                .type(Chat.Type.SAVED)
                .ownerId(ownerId).build();

        chatRepository.save(chat);

        return Optional.of(chat);
    }
}

// import dev.fenek.chats.dto.*;
// import dev.fenek.chats.model.*;

// import java.util.List;

// public class ChatMapper {

// private ChatMapper() {
// }

// public static Chat toEntity(ChatCreateRequest dto) {
// Chat chat = new Chat();
// chat.setTitle(dto.getTitle());
// chat.setDescription(dto.getDescription());
// chat.setGroup(dto.isGroup());
// return chat;
// }

// public static ChatResponse toDto(Chat entity, List<ChatMember> members) {
// ChatResponse dto = new ChatResponse();
// dto.setId(entity.getId());
// dto.setTitle(entity.getTitle());
// dto.setDescription(entity.getDescription());
// dto.setGroup(entity.isGroup());
// dto.setCreatedAt(entity.getCreatedAt());
// dto.setMembers(
// members.stream()
// .map(m -> new ChatMemberResponse(m.getUserId(), m.getRole().name()))
// .toList());
// return dto;
// }
// }
