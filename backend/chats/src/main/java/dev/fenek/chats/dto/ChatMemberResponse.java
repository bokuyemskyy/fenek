package dev.fenek.chats.dto;

import java.util.*;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMemberResponse {
    private UUID userId;
    private String role;
}
