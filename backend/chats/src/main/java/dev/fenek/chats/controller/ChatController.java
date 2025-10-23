package dev.fenek.chats.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.concurrent.atomic.AtomicLong;
import java.util.ArrayList;

@RestController
public class ChatController {

    private final List<Chat> chats = new ArrayList<>(Arrays.asList(
            new Chat(1L, "General"),
            new Chat(2L, "Random"),
            new Chat(3L, "Tech")));
    private final AtomicLong idGenerator = new AtomicLong(4);

    static class Chat {
        private Long id;
        private String name;

        public Chat(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }
    }

    static class ChatRequest {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    @GetMapping()
    public List<Chat> getChats() {
        return chats;
    }

    @PostMapping()
    public Chat addChat(@RequestBody ChatRequest request) {
        Chat newChat = new Chat(idGenerator.getAndIncrement(), request.getName());
        chats.add(newChat);
        return newChat;
    }
}
