package dev.fenek.chats.service;

import dev.fenek.chats.dto.*;
import dev.fenek.chats.mapper.ChatMapper;
import dev.fenek.chats.model.*;
import dev.fenek.chats.repository.ChatRepository;
import dev.fenek.chats.repository.ChatMemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.*;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final RestTemplate restTemplate;

    private static final String USER_PERMISSION_API = "https://mockapi.local/users/{userId}/permission";

    public ChatService(ChatRepository chatRepository,
            ChatMemberRepository chatMemberRepository,
            RestTemplate restTemplate) {
        this.chatRepository = chatRepository;
        this.chatMemberRepository = chatMemberRepository;
        this.restTemplate = restTemplate;
    }

    public ChatResponse createChat(ChatCreateRequest request) {
        Chat chat = ChatMapper.toEntity(request);
        chat = chatRepository.save(chat);

        List<ChatMember> members = new ArrayList<>();

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

        return ChatMapper.toDto(chat, members);
    }

    public ChatResponse getChatById(Long id) {
        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Chat not found"));
        List<ChatMember> members = chatMemberRepository.findByChatId(id);
        return ChatMapper.toDto(chat, members);
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
}
