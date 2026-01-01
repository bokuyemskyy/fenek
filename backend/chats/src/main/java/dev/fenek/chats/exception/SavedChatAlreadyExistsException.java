package dev.fenek.chats.exception;

public class SavedChatAlreadyExistsException extends RuntimeException {
    public SavedChatAlreadyExistsException() {
        super("Saved chat already exists");
    }
}