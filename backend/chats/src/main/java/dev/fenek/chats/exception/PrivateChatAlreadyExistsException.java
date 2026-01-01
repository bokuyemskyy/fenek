package dev.fenek.chats.exception;

public class PrivateChatAlreadyExistsException extends RuntimeException {
    public PrivateChatAlreadyExistsException() {
        super("Private chat already exists");
    }
}