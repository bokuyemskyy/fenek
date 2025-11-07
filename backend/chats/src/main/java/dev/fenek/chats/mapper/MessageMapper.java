package dev.fenek.chats.mapper;

import java.util.UUID;

import dev.fenek.chats.dto.MessageRequest;
import dev.fenek.chats.dto.MessageResponse;
import dev.fenek.chats.model.Message;
import dev.fenek.chats.model.Chat;

public class MessageMapper {

    private MessageMapper() {
    }

    public static Message toEntity(MessageRequest dto, UUID senderId, Chat chat, Message replyTo) {
        Message message = new Message();
        message.setChat(chat);
        message.setSenderId(senderId);
        message.setContent(dto.getContent());
        if (replyTo != null) {
            message.setReplyTo(replyTo);
        }
        return message;
    }

    public static MessageResponse toDto(Message entity) {
        MessageResponse dto = new MessageResponse();
        dto.setId(entity.getId());
        dto.setSenderId(entity.getSenderId());
        dto.setContent(entity.getContent());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setEditedAt(entity.getEditedAt());
        dto.setReplyToId(entity.getReplyTo() != null ? entity.getReplyTo().getId() : null);
        return dto;
    }
}
