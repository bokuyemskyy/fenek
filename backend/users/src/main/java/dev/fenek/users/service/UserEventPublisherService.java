package dev.fenek.users.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import dev.fenek.users.config.UserEventsConfig;
import dev.fenek.users.dto.UserCreatedEvent;
import dev.fenek.users.model.User;

@Service
public class UserEventPublisherService {
    private final RabbitTemplate rabbitTemplate;

    public UserEventPublisherService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishUserCreated(User user) {
        UserCreatedEvent event = new UserCreatedEvent(user.getId(), user.getEmail(), user.getCreatedAt());

        rabbitTemplate.convertAndSend(UserEventsConfig.EXCHANGE, "user.created", event);
    }
}
