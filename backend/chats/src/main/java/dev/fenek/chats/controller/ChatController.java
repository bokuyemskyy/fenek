package dev.fenek.chats.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {
    @GetMapping("/test")
    public String test() {
        return "Chat microservice running!";
    }
}
