package dev.fenek.chats.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public class ChatMemberId implements Serializable {
    private Long chat;
    private UUID userId;

    public ChatMemberId() {
    }

    public ChatMemberId(Long chat, UUID userId) {
        this.chat = chat;
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ChatMemberId that = (ChatMemberId) o;
        return Objects.equals(chat, that.chat) &&
                Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(chat, userId);
    }
}
