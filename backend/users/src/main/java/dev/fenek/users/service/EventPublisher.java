package dev.fenek.users.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import dev.fenek.users.config.UserEventsConfig;
import dev.fenek.users.dto.UserCreatedEvent;
import dev.fenek.users.dto.UserUpdatedEvent;
import dev.fenek.users.model.User;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publishUserCreated(User user) {
        UserCreatedEvent event = new UserCreatedEvent(user.getId(), user.getEmail(), user.getCreatedAt());

        rabbitTemplate.convertAndSend(UserEventsConfig.EXCHANGE, "users.user.created", event);
    }

    public void publishUserUpdated(User user) {
        UserUpdatedEvent event = new UserUpdatedEvent(user.getId());

        rabbitTemplate.convertAndSend(UserEventsConfig.EXCHANGE, "users.user.updated", event);
    }
}
