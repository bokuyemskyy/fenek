package dev.fenek.chats.model;

import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;

@Entity
@Table(name = "chat_members")
@IdClass(ChatMemberId.class)
@Getter
@Setter
public class ChatMember {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id", nullable = false, updatable = false)
    private Chat chat;

    @Id
    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "joined_at", nullable = false, updatable = false)
    @Setter(lombok.AccessLevel.NONE)
    private Instant joinedAt;

    @PrePersist
    protected void onJoin() {
        joinedAt = Instant.now();
    }

    public enum Role {
        MEMBER,
        ADMIN
    }
}
