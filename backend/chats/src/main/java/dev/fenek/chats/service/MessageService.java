package dev.fenek.chats.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import dev.fenek.chats.config.ChatEventsConfig;
import dev.fenek.chats.config.ChatRoutingKeys;
import dev.fenek.chats.config.EventConfig;
import dev.fenek.chats.config.EventConfig.RoutingKeys;
import dev.fenek.chats.dto.MessageCreatedEvent;
import dev.fenek.chats.dto.MessageDeletedEvent;
import dev.fenek.chats.dto.MessageUpdatedEvent;
import dev.fenek.chats.dto.ReactionCreatedEvent;
import dev.fenek.chats.dto.ReactionDeletedEvent;
import dev.fenek.chats.dto.TypingStartedEvent;
import dev.fenek.chats.dto.TypingStoppedEvent;
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

        rabbitTemplate.convertAndSend(EventConfig.EXCHANGE, RoutingKeys.MESSAGE_DELETED,
                MessageDeletedEvent.from(message));

        return message;
    }

    public Message update(UUID id, UUID userId, String content) {
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

        rabbitTemplate.convertAndSend(EventConfig.EXCHANGE, RoutingKeys.MESSAGE_UPDATED,
                MessageUpdatedEvent.from(message));

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

        rabbitTemplate.convertAndSend(EventConfig.EXCHANGE, RoutingKeys.MESSAGE_CREATED,
                MessageCreatedEvent.from(message));

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
            rabbitTemplate.convertAndSend(EventConfig.EXCHANGE, RoutingKeys.REACTION_DELETED,
                    ReactionDeletedEvent.of(id, userId));
        }

        MessageReaction reaction = MessageReaction.builder()
                .message(message)
                .userId(userId)
                .emoji(emoji)
                .build();

        messageReactionRepository.save(reaction);

        rabbitTemplate.convertAndSend(EventConfig.EXCHANGE, RoutingKeys.REACTION_CREATED,
                ReactionCreatedEvent.from(reaction));
    }

    public void unreact(UUID id, UUID userId) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new MessageNotFoundException());
        if (!chatService.isMember(userId, message.getChat().getId())) {
            throw new ChatNotFoundException();
        }

        int deleted = messageReactionRepository.deleteByMessageIdAndUserId(id, userId);

        if (deleted > 0) {
            rabbitTemplate.convertAndSend(EventConfig.EXCHANGE, RoutingKeys.REACTION_DELETED,
                    ReactionDeletedEvent.of(id, userId));
        }
    }

    public void startTyping(UUID userId, UUID chatId) {
        if (!chatService.isMember(userId, chatId)) {
            throw new ChatNotFoundException();
        }

        rabbitTemplate.convertAndSend(EventConfig.REALTIME_EXCHANGE, RoutingKeys.TYPING_STARTED,
                new TypingStartedEvent(chatId, userId));
    }

    public void stopTyping(UUID userId, UUID chatId) {
        if (!chatService.isMember(userId, chatId)) {
            throw new ChatNotFoundException();
        }

        rabbitTemplate.convertAndSend(EventConfig.REALTIME_EXCHANGE, RoutingKeys.TYPING_STOPPED,
                new TypingStoppedEvent(chatId, userId));
    }
}
