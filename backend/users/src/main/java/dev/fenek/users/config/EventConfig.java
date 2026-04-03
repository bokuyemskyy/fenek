package dev.fenek.users.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EventConfig {
    public static final String USERS_EXCHANGE = "users.exchange";
    public static final String LAST_SEEN_QUEUE = "users.lastseen.events";

    @Bean
    TopicExchange usersExchange() {
        return new TopicExchange(USERS_EXCHANGE);
    }

    @Bean
    Queue lastSeenQueue() {
        return new Queue(LAST_SEEN_QUEUE, true);
    }

    @Bean
    Binding lastSeenBinding() {
        return BindingBuilder.bind(lastSeenQueue())
                .to(usersExchange())
                .with("users.user.lastseen");
    }
}
