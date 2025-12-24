package dev.fenek.chats.dto;

import java.util.*;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import dev.fenek.chats.model.ChatMember.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMemberResponse {
    private UUID userId;
    private Role role;
}
