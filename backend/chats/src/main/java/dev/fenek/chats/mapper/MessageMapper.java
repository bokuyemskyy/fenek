package dev.fenek.chats.mapper;

import org.springframework.stereotype.Component;

import dev.fenek.chats.dto.MessageDto;
import dev.fenek.chats.model.Message;
import dev.fenek.chats.model.Chat;
import dev.fenek.chats.repository.ChatRepository;
import dev.fenek.chats.repository.MessageRepository;

@Component
public class MessageMapper {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;

    public MessageMapper(ChatRepository chatRepository, MessageRepository messageRepository) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
    }

    public Message toEntity(MessageDto dto) {
        Message message = new Message();

        Chat chat = chatRepository.findById(dto.getChatId())
                .orElseThrow(() -> new IllegalArgumentException("Chat not found: " + dto.getChatId()));
        message.setChat(chat);
        message.setSenderId(dto.getSenderId());
        message.setContent(dto.getContent());
        message.setEditedAt(dto.getEditedAt());
        message.setDeletedAt(dto.getDeletedAt());

        if (dto.getReplyToId() != null) {
            Message replyTo = messageRepository.findById(dto.getReplyToId())
                    .orElseThrow(() -> new IllegalArgumentException("Reply message not found: " + dto.getReplyToId()));
            message.setReplyTo(replyTo);
        }

        return message;
    }

    public MessageDto toDto(Message entity) {
        MessageDto dto = new MessageDto();
        dto.setId(entity.getId());
        dto.setChatId(entity.getChat().getId());
        dto.setContent(entity.getContent());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setDeletedAt(entity.getDeletedAt());
        dto.setEditedAt(entity.getEditedAt());
        dto.setReplyToId(entity.getReplyTo().getId());
        dto.setSenderId(entity.getSenderId());
        return dto;
    }
}
