package dev.fenek.chats.dto;

import java.util.*;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMemberResponse {
    private UUID userId;
    private String role;
}
