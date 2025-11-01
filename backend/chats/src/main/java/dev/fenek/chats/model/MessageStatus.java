package dev.fenek.chats.model;

import java.time.Instant;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;

@Entity
@Table(name = "message_status")
@IdClass(MessageStatusId.class)
@Getter
@Setter
public class MessageStatus {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", nullable = false, updatable = false)
    private Message message;

    @Id
    @Column(name = "user_id", updatable = false)
    private UUID userId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(nullable = false)
    @Setter(lombok.AccessLevel.NONE)
    private Instant updatedAt;

    public enum Status {
        SENT, DELIVERED, READ
    }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
