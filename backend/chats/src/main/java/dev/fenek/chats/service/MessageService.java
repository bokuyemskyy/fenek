package dev.fenek.chats.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import dev.fenek.chats.model.Message;
import dev.fenek.chats.repository.MessageRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;

    public Message delete(UUID id, UUID userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

    public Message edit(UUID id, UUID userId, String content) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'edit'");
    }

    public Message create(UUID userId, UUID chatId, String content) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'create'");
    }

}
