package dev.fenek.chats.model;

import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;

@Entity
@Table(name = "messages", indexes = {
        @Index(name = "messages_idx_chat", columnList = "chatId"),
        @Index(name = "messages_idx_sender", columnList = "senderId"),
        @Index(name = "messages_idx_created", columnList = "createdAt"),
        @Index(name = "messages_idx_reply_to", columnList = "replyToId")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Chat chat;

    @Column(nullable = false, updatable = false)
    private UUID senderId;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant editedAt;

    private Instant deletedAt;

    @JoinColumn(updatable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Message replyTo;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Type type;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();

        if (replyTo != null && replyTo.getId().equals(this.id)) {
            throw new IllegalStateException("Message cannot reply to itself");
        }
    }

    public enum Type {
        TEXT,
        IMAGE,
        FILE,
        SYSTEM
    }
}
