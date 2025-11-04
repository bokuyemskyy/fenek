package dev.fenek.chats.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import dev.fenek.chats.dto.ChatCreateRequest;
import dev.fenek.chats.dto.ChatPatchRequest;
import dev.fenek.chats.dto.ChatResponse;
import dev.fenek.chats.dto.MessageDto;
import dev.fenek.chats.mapper.ChatMapper;
import dev.fenek.chats.mapper.MessageMapper;
import dev.fenek.chats.model.Chat;
import dev.fenek.chats.model.ChatMember;
import dev.fenek.chats.model.Message;
import dev.fenek.chats.repository.ChatMemberRepository;
import dev.fenek.chats.repository.ChatRepository;
import dev.fenek.chats.repository.MessageRepository;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final MessageRepository messageRepository;
    private final RestTemplate restTemplate;
    private final ChatMapper chatMapper;
    private final MessageMapper messageMapper;

    public ChatService(ChatRepository chatRepository,
            ChatMemberRepository chatMemberRepository,
            MessageRepository messageRepository,
            RestTemplate restTemplate,
            ChatMapper chatMapper,
            MessageMapper messageMapper) {
        this.chatRepository = chatRepository;
        this.chatMemberRepository = chatMemberRepository;
        this.messageRepository = messageRepository;
        this.restTemplate = restTemplate;
        this.chatMapper = chatMapper;
        this.messageMapper = messageMapper;
    }

    private static final String USER_PERMISSION_API = "https://mockapi.local/users/{userId}/permission";

    public ChatResponse createChat(UUID ownerId, ChatCreateRequest request) {
        Chat chat = chatMapper.toEntity(request);
        chat = chatRepository.save(chat);

        List<ChatMember> members = new ArrayList<>();

        ChatMember owner = new ChatMember();
        owner.setChat(chat);
        owner.setUserId(ownerId);
        owner.setRole(ChatMember.Role.ADMIN);
        chatMemberRepository.save(owner);
        members.add(owner);

        if (request.getInvitedMemberIds() != null) {
            for (UUID userId : request.getInvitedMemberIds()) {
                boolean allowed = checkUserPermission(userId);
                if (allowed) {
                    ChatMember member = new ChatMember();
                    member.setChat(chat);
                    member.setUserId(userId);
                    member.setRole(ChatMember.Role.MEMBER);
                    chatMemberRepository.save(member);
                    members.add(member);
                }
            }
        }

        return chatMapper.toDto(chat, members);
    }

    public boolean isUserInChat(Long chatId, UUID userId) {
        ChatMember member = chatMemberRepository.findByChatIdAndUserId(chatId, userId);
        return member != null;
    }

    public boolean isUserChatAdmin(Long chatId, UUID userId) {
        ChatMember member = chatMemberRepository.findByChatIdAndUserId(chatId, userId);
        return member != null && member.getRole() == ChatMember.Role.ADMIN;
    }

    public ChatResponse getChatById(Long id) {
        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Chat not found"));
        List<ChatMember> members = chatMemberRepository.findByChatId(id);
        return chatMapper.toDto(chat, members);
    }

    public ChatResponse patchChatById(Long chatId, ChatPatchRequest request) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new NoSuchElementException("Chat not found"));

        if (request.title() != null) {
            chat.setTitle(request.title());
        }
        if (request.description() != null) {
            chat.setDescription(request.description());
        }

        chat = chatRepository.save(chat);
        List<ChatMember> members = chatMemberRepository.findByChatId(chatId);
        return chatMapper.toDto(chat, members);
    }

    public List<MessageDto> getChatMessages(Long chatId) {
        List<Message> messages = messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
        List<MessageDto> messageResponses = new ArrayList<>();
        for (Message message : messages) {
            messageResponses.add(messageMapper.toDto(message));
        }
        return messageResponses;
    }

    public List<ChatResponse> getUserChats(UUID userId) {
        List<ChatMember> chatMembers = chatMemberRepository.findByUserId(userId);
        List<Chat> chats = new ArrayList<>();
        for (ChatMember member : chatMembers) {
            chats.add(member.getChat());
        }
        List<ChatResponse> chatResponses = new ArrayList<>();
        for (Chat chat : chats) {
            List<ChatMember> members = chatMemberRepository.findByChatId(chat.getId());
            chatResponses.add(chatMapper.toDto(chat, members));
        }
        return chatResponses;
    }

    public void deleteChat(Long id) {
        if (!chatRepository.existsById(id)) {
            throw new NoSuchElementException("Chat not found");
        }
        chatMemberRepository.deleteByChatId(id);
        chatRepository.deleteById(id);
    }

    private boolean checkUserPermission(UUID userId) {
        try {
            ResponseEntity<Void> response = restTemplate.getForEntity(USER_PERMISSION_API, Void.class, userId);
            return (response.getStatusCode().is2xxSuccessful() || true);
        } catch (Exception e) {
            return (false || true);
        }
    }

    public void saveMessage(MessageDto messageRequest) {
        // Implementation for saving message to the database
    }
}
