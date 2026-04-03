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
    // ===== Chat service internal events =====
    // Persistent functionality
    public static final String CHATS_EXCHANGE = "chats.exchange";
    public static final String CHATS_QUEUE = "chats.events";

    public static final String CHATS_REALTIME_EXCHANGE = "chats.realtime.exchange";
    public static final String CHATS_REALTIME_QUEUE = "chats.realtime.events";

    @Bean
    public Queue persistentQueue() {
        return new Queue(CHATS_QUEUE, true);
    }

    @Bean
    TopicExchange persistentExchange() {
        return new TopicExchange(CHATS_EXCHANGE);
    }

    @Bean
    Binding persistentBinding() {
        return BindingBuilder.bind(persistentQueue())
                .to(persistentExchange())
                .with("chats.#");
    }

    // Ephemeral functionality
    @Bean
    public Queue ephemeralQueue() {
        return QueueBuilder
                .nonDurable(CHATS_REALTIME_QUEUE)
                .autoDelete()
                .ttl(10000)
                .build();
    }

    @Bean
    TopicExchange realtimeExchange() {
        return new TopicExchange(CHATS_REALTIME_EXCHANGE);
    }

    @Bean
    Binding realtimeBinding() {
        return BindingBuilder.bind(ephemeralQueue())
                .to(realtimeExchange())
                .with("realtime.#");
    }

    // ===== External events from user service =====
    // User functionality
    public static final String USERS_EXCHANGE = "users.exchange";
    public static final String USERS_UPDATED_QUEUE = "chats.users.updated";
    public static final String USERS_CREATED_QUEUE = "chats.users.created";

    @Bean
    Queue userUpdatedQueue() {
        return new Queue(USERS_UPDATED_QUEUE, true);
    }

    @Bean
    Queue userCreatedQueue() {
        return new Queue(USERS_CREATED_QUEUE, true);
    }

    @Bean
    TopicExchange userExchange() {
        return new TopicExchange(USERS_EXCHANGE);
    }

    @Bean
    Binding userUpdatedBinding() {
        return BindingBuilder.bind(userUpdatedQueue()).to(userExchange()).with("users.user.updated");
    }

    @Bean
    Binding userCreatedBinding() {
        return BindingBuilder.bind(userCreatedQueue()).to(userExchange()).with("users.user.created");
    }

    // All the routing keys
    public final class RoutingKeys {
        private RoutingKeys() {
        }

        public static final String MESSAGE_CREATED = "chats.message.created";

        public static final String MESSAGE_UPDATED = "chats.message.updated";

        public static final String MESSAGE_DELETED = "chats.message.deleted";

        public static final String REACTION_CREATED = "chats.reaction.created";

        public static final String REACTION_DELETED = "chats.reaction.deleted";

        public static final String TYPING = "realtime.typing";

        public static final String ONLINE = "realtime.online";

        public static final String OFFLINE = "realtime.offline";

        public static final String USER_UPDATED = "users.user.updated";

        public static final String USER_CREATED = "users.user.created";

        public static final String USER_LAST_SEEN = "users.user.lastseen";
    }
}
