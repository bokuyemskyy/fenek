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
public class ChatCreateRequest {
    private String title;
    private String description;
    private boolean isGroup;
    private List<UUID> invitedMemberIds;
}
