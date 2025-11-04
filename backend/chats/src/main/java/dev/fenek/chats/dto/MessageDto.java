package dev.fenek.chats.dto;

import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {

    private Long id;
    private UUID senderId;
    private String content;
    private Instant createdAt;
    private Instant editedAt;
    private Instant deletedAt;
    private Long chatId;
    private Long replyToId;

}
