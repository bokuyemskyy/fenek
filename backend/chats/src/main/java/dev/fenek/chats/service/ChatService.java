package dev.fenek.chats.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.fenek.chats.model.Chat;
import dev.fenek.chats.model.ChatMember;
import dev.fenek.chats.model.Message;
import dev.fenek.chats.repository.ChatMemberRepository;
import dev.fenek.chats.repository.ChatRepository;
import dev.fenek.chats.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import dev.fenek.chats.dto.ChatResponse;
import dev.fenek.chats.exception.CannotChatWithYourselfException;
import dev.fenek.chats.exception.PrivateChatAlreadyExistsException;
import dev.fenek.chats.exception.SavedChatAlreadyExistsException;

@Service
@RequiredArgsConstructor
public class ChatService {

        private final ChatRepository chatRepository;
        private final ChatMemberRepository chatMemberRepository;
        private final MessageRepository messageRepository;

        public List<UUID> getOtherMemberIds(UUID userId, UUID chatId) {
                return chatMemberRepository.findOtherMembers(List.of(chatId), userId).stream()
                                .map(member -> member.getId())
                                .toList();
        }

        public boolean isMember(UUID userId, UUID chatId) {
                return chatMemberRepository.existsByChatIdAndUserId(chatId, userId);
        }

        public ChatResponse createSavedChat(UUID userId) {
                if (chatRepository.existsByOwnerIdAndType(userId, Chat.Type.SAVED)) {
                        throw new SavedChatAlreadyExistsException();
                }

                Chat chat = Chat.builder()
                                .title("Saved messages")
                                .description("Your personal space for saving messages.")
                                .type(Chat.Type.SAVED)
                                .ownerId(userId)
                                .build();

                chatRepository.save(chat);

                ChatMember initiator = ChatMember.builder()
                                .chat(chat)
                                .userId(userId)
                                .role(ChatMember.Role.OWNER)
                                .build();

                chatMemberRepository.save(initiator);

                return ChatResponse.builder()
                                .id(chat.getId())
                                .title(chat.getTitle())
                                .description(chat.getDescription())
                                .type(chat.getType())
                                .createdAt(chat.getCreatedAt())
                                .build();
        }

        @Transactional
        public ChatResponse createPrivateChat(UUID userId, UUID otherUserId) {
                if (userId.equals(otherUserId)) {
                        throw new CannotChatWithYourselfException();
                }

                if (chatRepository.findPrivateChatBetweenUsers(userId, otherUserId).isPresent()) {
                        throw new PrivateChatAlreadyExistsException();
                }

                Chat chat = Chat.builder()
                                .type(Chat.Type.PRIVATE)
                                .ownerId(userId)
                                .build();

                chat = chatRepository.save(chat);

                ChatMember initiator = ChatMember.builder()
                                .chat(chat)
                                .userId(userId)
                                .role(ChatMember.Role.OWNER)
                                .build();

                ChatMember recipient = ChatMember.builder()
                                .chat(chat)
                                .userId(otherUserId)
                                .role(ChatMember.Role.MEMBER)
                                .build();

                chatMemberRepository.saveAll(List.of(initiator, recipient));

                return ChatResponse.builder()
                                .id(chat.getId())
                                .title(chat.getTitle())
                                .description(chat.getDescription())
                                .type(chat.getType())
                                .createdAt(chat.getCreatedAt()).build();
        }

        public List<ChatResponse> getChats(UUID userId) {
                List<ChatMember> chatMembers = chatMemberRepository.findByUserId(userId);

                List<UUID> chatIds = chatMembers.stream()
                                .map(cm -> cm.getChat().getId())
                                .toList();

                Map<UUID, Message> lastMessageMap = messageRepository.findLastMessagesForChats(chatIds)
                                .stream()
                                .collect(Collectors.toMap(
                                                m -> m.getChat().getId(),
                                                Function.identity()));

                List<UUID> privateChatIds = chatMembers.stream()
                                .map(ChatMember::getChat)
                                .filter(chat -> chat.getType() == Chat.Type.PRIVATE)
                                .map(Chat::getId)
                                .toList();

                Map<UUID, UUID> chatToOtherUserId = chatMemberRepository.findOtherMembers(privateChatIds, userId)
                                .stream()
                                .collect(Collectors.toMap(
                                                cm -> cm.getChat().getId(),
                                                ChatMember::getUserId));

                return chatMembers.stream().map(chatMember -> {
                        Chat chat = chatMember.getChat();
                        Message lastMessage = lastMessageMap.get(chat.getId());

                        String lastMessageSnippet = null;
                        Instant lastMessageTimestamp = null;

                        if (lastMessage != null) {
                                String content = lastMessage.getContent();
                                lastMessageTimestamp = lastMessage.getCreatedAt();
                                if (content != null) {
                                        lastMessageSnippet = content.length() > 50
                                                        ? content.substring(0, 50)
                                                        : content;
                                }
                        }

                        String title = null;
                        String description = null;
                        String imageUrl = null;

                        switch (chat.getType()) {

                                case PRIVATE -> {
                                        UUID otherUserId = chatToOtherUserId.get(chat.getId());

                                        return ChatResponse.builder()
                                                        .id(chat.getId())
                                                        .type(chat.getType())
                                                        .otherUserId(otherUserId)
                                                        .lastMessageSnippet(lastMessageSnippet)
                                                        .lastMessageTimestamp(lastMessageTimestamp)
                                                        .createdAt(chat.getCreatedAt())
                                                        .build();
                                }

                                case SAVED -> {
                                        title = "Saved messages";
                                        description = "You can send what you want to save here";
                                }

                                case GROUP, CHANNEL -> {
                                        title = chat.getTitle();
                                        description = chat.getDescription();
                                }

                                default -> throw new IllegalStateException();
                        }

                        return ChatResponse.builder()
                                        .id(chat.getId())
                                        .type(chat.getType())
                                        .title(title)
                                        .description(description)
                                        .imageUrl(imageUrl)
                                        .lastMessageSnippet(lastMessageSnippet)
                                        .lastMessageTimestamp(lastMessageTimestamp)
                                        .createdAt(chat.getCreatedAt())
                                        .build();
                }).toList();
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
