package dev.fenek.chats.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import dev.fenek.chats.config.ChatEventsConfig;
import dev.fenek.chats.dto.MessageEvent;
import dev.fenek.chats.dto.ReactionEvent;
import dev.fenek.chats.dto.TypingEvent;
import dev.fenek.chats.exception.ChatNotFoundException;
import dev.fenek.chats.exception.MessageNotFoundException;
import dev.fenek.chats.exception.NotAllowedToModifyMessageException;
import dev.fenek.chats.model.Chat;
import dev.fenek.chats.model.Message;
import dev.fenek.chats.model.MessageReaction;
import dev.fenek.chats.repository.ChatRepository;
import dev.fenek.chats.repository.MessageReactionRepository;
import dev.fenek.chats.repository.MessageRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final MessageReactionRepository messageReactionRepository;
    private final ChatRepository chatRepository;
    private final ChatService chatService;
    private final RabbitTemplate rabbitTemplate;

    public Message delete(UUID id, UUID userId) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new MessageNotFoundException());
        if (!message.getSenderId().equals(userId)) {
            throw new NotAllowedToModifyMessageException();
        }
        if (!chatService.isMember(userId, message.getChat().getId())) {
            throw new ChatNotFoundException();
        }

        message.setDeletedAt(Instant.now());

        messageRepository.save(message);

        MessageEvent event = MessageEvent.deleted(message);

        rabbitTemplate.convertAndSend(ChatEventsConfig.EXCHANGE, "chats.event.deleted", event);

        return message;
    }

    public Message edit(UUID id, UUID userId, String content) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new MessageNotFoundException());

        if (!message.getSenderId().equals(userId)) {
            throw new NotAllowedToModifyMessageException();
        }
        if (!chatService.isMember(userId, message.getChat().getId())) {
            throw new ChatNotFoundException();
        }

        message.setContent(content);

        messageRepository.save(message);

        MessageEvent event = MessageEvent.edited(message);

        rabbitTemplate.convertAndSend(ChatEventsConfig.EXCHANGE, "chats.event.updated", event);

        return message;
    }

    public Message create(UUID userId, UUID chatId, String content, UUID replyToId) {
        if (!chatService.isMember(userId, chatId)) {
            throw new ChatNotFoundException();
        }

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatNotFoundException());

        Message message = Message.builder()
                .chat(chat)
                .senderId(userId)
                .content(content)
                .type(Message.Type.TEXT)
                .build();

        if (replyToId != null) {
            Message replyTo = messageRepository.findById(replyToId)
                    .orElseThrow(() -> new MessageNotFoundException());
            message.setReplyTo(replyTo);
        }

        messageRepository.save(message);

        MessageEvent event = MessageEvent.created(message);

        rabbitTemplate.convertAndSend(ChatEventsConfig.EXCHANGE, "chats.event.created", event);

        return message;
    }

    public void react(UUID id, UUID userId, String emoji) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new MessageNotFoundException());
        if (!chatService.isMember(userId, message.getChat().getId())) {
            throw new ChatNotFoundException();
        }

        int deleted = messageReactionRepository.deleteByMessageIdAndUserId(id, userId);

        if (deleted > 0) {
            ReactionEvent event = ReactionEvent.deleted(id, userId);
            rabbitTemplate.convertAndSend(ChatEventsConfig.EXCHANGE, "chats.event.react", event);
        }

        MessageReaction reaction = MessageReaction.builder()
                .message(message)
                .userId(userId)
                .emoji(emoji)
                .build();

        messageReactionRepository.save(reaction);

        ReactionEvent event = ReactionEvent.created(reaction);

        rabbitTemplate.convertAndSend(ChatEventsConfig.EXCHANGE, "chats.event.react", event);
    }

    public void unreact(UUID id, UUID userId) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new MessageNotFoundException());
        if (!chatService.isMember(userId, message.getChat().getId())) {
            throw new ChatNotFoundException();
        }

        int deleted = messageReactionRepository.deleteByMessageIdAndUserId(id, userId);

        if (deleted > 0) {
            ReactionEvent event = ReactionEvent.deleted(id, userId);
            rabbitTemplate.convertAndSend(ChatEventsConfig.EXCHANGE, "chats.event.react", event);
        }
    }

    public void typing(UUID userId, UUID chatId, boolean typing) {
        if (!chatService.isMember(userId, chatId)) {
            throw new ChatNotFoundException();
        }

        TypingEvent event = new TypingEvent(chatId, userId, typing);

        rabbitTemplate.convertAndSend(ChatEventsConfig.EXCHANGE, "chats.event.typing", event);
    }
}
