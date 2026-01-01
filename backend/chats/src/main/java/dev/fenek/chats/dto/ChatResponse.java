package dev.fenek.chats.dto;

import java.time.Instant;
import java.util.*;

import dev.fenek.chats.model.Chat.Type;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatResponse {
    private UUID id;
    private String title;
    private String description;
    private String lastMessage;
    private Instant timestamp;
    private Type type;
    private Instant createdAt;
    private String avatarUrl;
}
