package dev.fenek.chats.dto;

import java.time.Instant;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonInclude;

import dev.fenek.chats.model.Chat.Type;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// Will hide null fields from JSON when sent to frontend
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatResponse {
    private UUID id;
    private Type type;

    // Field for private chats
    // Only populated if type is Type.PRIVATE
    private UUID otherUserId;

    // Fields for non-private chats
    // Only populated if type is not Type.PRIVATE
    private String title;
    private String description;
    private String imageUrl;

    // Common fields
    private String lastMessageSnippet;
    private Instant lastMessageTimestamp;
    private Instant createdAt;
}