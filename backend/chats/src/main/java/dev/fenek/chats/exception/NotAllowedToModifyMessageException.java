package dev.fenek.chats.exception;

public class NotAllowedToModifyMessageException extends RuntimeException {
    public NotAllowedToModifyMessageException() {
        super("You do not belong to the chat");
    }
}