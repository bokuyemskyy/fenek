package dev.fenek.chats.model;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

import jakarta.persistence.*;

@Entity
@Table(name = "chats")
@Getter
@Setter
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    @Setter(lombok.AccessLevel.NONE)
    private Long id;

    @Column(name = "is_group", nullable = false, updatable = false)
    private boolean isGroup;

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Setter(lombok.AccessLevel.NONE)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
