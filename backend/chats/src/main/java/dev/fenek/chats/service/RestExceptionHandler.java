package dev.fenek.chats.service;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import dev.fenek.chats.exception.CannotChatWithYourselfException;
import dev.fenek.chats.exception.PrivateChatAlreadyExistsException;
import dev.fenek.chats.exception.SavedChatAlreadyExistsException;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(CannotChatWithYourselfException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleCannotChatWithYourself(CannotChatWithYourselfException e) {
        return Map.of("error", e.getMessage());
    }

    @ExceptionHandler(PrivateChatAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handlePrivateChatExists(PrivateChatAlreadyExistsException e) {
        return Map.of("error", e.getMessage());
    }

    @ExceptionHandler(SavedChatAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleSavedChatExists(SavedChatAlreadyExistsException e) {
        return Map.of("error", e.getMessage());
    }
}