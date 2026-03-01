package dev.fenek.chats.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EventConfig {
    public static final String EXCHANGE = "chats.exchange";
    public static final String REALTIME_EXCHANGE = "chats.realtime.exchange";
    public static final String QUEUE = "chats.events";
    public static final String REALTIME_QUEUE = "chats.realtime.events";
    public static final String ROUTING_KEY = "chats.#";
    public static final String REALTIME_ROUTING_KEY = "chats.realtime.#";

    @Bean
    public Queue persistentEventsQueue() {
        return new Queue(QUEUE, true);
    }

    @Bean
    public Queue ephemeralEventsQueue() {
        return QueueBuilder
                .nonDurable(REALTIME_QUEUE)
                .exclusive()
                .autoDelete()
                .ttl(15000)
                .build();
    }

    @Bean
    TopicExchange persistentEventsExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    TopicExchange ephemeralEventsExchange() {
        return new TopicExchange(REALTIME_EXCHANGE);
    }

    @Bean
    Binding persistentEventsBinding() {
        return BindingBuilder.bind(persistentEventsQueue())
                .to(persistentEventsExchange())
                .with(ROUTING_KEY);
    }

    @Bean
    Binding ephemeralEventsBinding() {
        return BindingBuilder.bind(ephemeralEventsQueue())
                .to(ephemeralEventsExchange())
                .with(REALTIME_ROUTING_KEY);
    }

    public final class RoutingKeys {
        private RoutingKeys() {
        }

        public static final String MESSAGE_CREATED = "chats.message.created";

        public static final String MESSAGE_UPDATED = "chats.message.updated";

        public static final String MESSAGE_DELETED = "chats.message.deleted";

        public static final String REACTION_CREATED = "chats.reaction.created";

        public static final String REACTION_DELETED = "chats.reaction.deleted";

        public static final String TYPING_STARTED = "realtime.typing.started";

        public static final String TYPING_STOPPED = "realtime.typing.stopped";
    }
}
