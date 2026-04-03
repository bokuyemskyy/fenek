package dev.fenek.users.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import dev.fenek.users.config.EventConfig;
import dev.fenek.users.dto.UserLastSeenEvent;
import dev.fenek.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventConsumer {
    private final UserRepository userRepository;

    @RabbitListener(queues = EventConfig.LAST_SEEN_QUEUE)
    public void handleLastSeenQueue(UserLastSeenEvent payload) {
        userRepository.updateLastSeen(payload.userId(), payload.lastSeen());
    }
}
