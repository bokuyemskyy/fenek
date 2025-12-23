package dev.fenek.chats.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import dev.fenek.chats.config.UserEventsListenerConfig;
import dev.fenek.chats.dto.UserCreatedEvent;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserCreatedListener {
    private final ChatService chatService;

    @RabbitListener(queues = UserEventsListenerConfig.QUEUE)
    public void onUserCreated(UserCreatedEvent event) {
        chatService.createSavedChat(event.userId());
    }
}
