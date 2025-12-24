package dev.fenek.chats.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import dev.fenek.chats.model.Message;

import java.util.UUID;

@Controller
public class MessageController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public Message sendMessage(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        UUID uid = (UUID) headerAccessor.getSessionAttributes().get("uid");
        message.setSenderId(uid);

        // save to db

        return message;
    }
}