package dev.fenek.chats.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatEventsConfig {
    public static final String QUEUE = "chats.events";
    public static final String EXCHANGE = "chats.exchange";
    public static final String ROUTING_KEY = "chats.event.#";

    @Bean
    public Queue chatEventsQueue() {
        return new Queue(QUEUE, true);
    }

    @Bean
    TopicExchange chatEventsExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    Binding chatEventsBinding() {
        return BindingBuilder.bind(chatEventsQueue())
                .to(chatEventsExchange())
                .with(ROUTING_KEY);
    }
}
