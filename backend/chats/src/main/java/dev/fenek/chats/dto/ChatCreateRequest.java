package dev.fenek.chats.dto;

import java.util.*;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatCreateRequest {
    private String title;
    private String description;
    private boolean isGroup;
    private List<UUID> invitedMemberIds;
}
