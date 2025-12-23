package dev.fenek.users.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.core.TopicExchange;

@Configuration
public class UserEventsConfig {
    public static final String EXCHANGE = "users.events";

    @Bean
    TopicExchange userEventsExchange() {
        return new TopicExchange(EXCHANGE);
    }
}
