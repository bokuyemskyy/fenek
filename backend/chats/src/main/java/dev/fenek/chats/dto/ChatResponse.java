package dev.fenek.chats.dto;

import java.time.Instant;
import java.util.*;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
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
