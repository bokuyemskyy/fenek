package dev.fenek.chats.exception;

public class ChatNotFoundException extends RuntimeException {
    public ChatNotFoundException() {
        super("You do not belong to the chat");
    }
}