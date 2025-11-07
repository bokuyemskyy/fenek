package dev.fenek.chats.dto;

import java.time.Instant;
import java.util.*;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private Long id;
    private String title;
    private String description;
    private boolean isGroup;
    private List<ChatMemberResponse> members;
    private Instant createdAt;
}
