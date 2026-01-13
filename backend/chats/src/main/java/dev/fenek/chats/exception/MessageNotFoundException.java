package dev.fenek.chats.exception;

public class MessageNotFoundException extends RuntimeException {
    public MessageNotFoundException() {
        super("You do not belong to the chat");
    }
}