package dev.fenek.chats.model;

import java.io.Serializable;
import java.util.UUID;

public class MessageStatusId implements Serializable {
    private Long message;
    private UUID userId;

    public MessageStatusId() {
    }

    public MessageStatusId(Long message, UUID userId) {
        this.message = message;
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        MessageStatusId that = (MessageStatusId) o;
        return message.equals(that.message) && userId.equals(that.userId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(message, userId);
    }
}
