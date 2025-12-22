package dev.fenek.chats.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.*;

@Entity
@Table(name = "chats", indexes = {
        @Index(name = "chats_idx_owner", columnList = "ownerId"),
        @Index(name = "chats_idx_type", columnList = "type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chat {
    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(length = 255)
    private String title;

    @Column(length = 1024)
    private String description;

    @Column(nullable = false)
    private UUID ownerId;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Type type;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    public enum Type {
        SAVED,
        PRIVATE,
        GROUP,
        CHANNEL
    }
}
