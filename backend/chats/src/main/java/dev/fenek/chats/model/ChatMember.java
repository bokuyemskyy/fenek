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
@Table(name = "chat_members", uniqueConstraints = @UniqueConstraint(columnNames = { "chatId", "userId" }), indexes = {
        @Index(name = "chat_members_idx_chat", columnList = "chatId"),
        @Index(name = "chat_members_idx_uid", columnList = "userId")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMember {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Chat chat;

    @Column(nullable = false, updatable = false)
    private UUID userId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false, updatable = false)
    private Instant joinedAt;

    @PrePersist
    protected void onJoin() {
        joinedAt = Instant.now();
    }

    public enum Role {
        MEMBER,
        ADMIN,
        OWNER
    }
}
