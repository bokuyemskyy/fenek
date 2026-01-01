package dev.fenek.chats.exception;

public class CannotChatWithYourselfException extends RuntimeException {
    public CannotChatWithYourselfException() {
        super("Cannot create a private chat with yourself");
    }
}
