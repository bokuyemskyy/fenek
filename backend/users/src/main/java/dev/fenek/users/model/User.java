package dev.fenek.users.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "provider", "providerId" }),
        @UniqueConstraint(columnNames = { "email" })
}, indexes = {
        @Index(name = "idx_users_provider", columnList = "provider,providerId"),
        @Index(name = "idx_users_email", columnList = "email")
})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 320)
    private String email;

    @Column(unique = true, length = 50)
    private String username;

    @Column(length = 100)
    private String displayName;

    @Column(length = 512)
    private String avatarUrl;

    @Column(nullable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    @Column(nullable = false, updatable = false, length = 100)
    private String providerId;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant lastLoginAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.lastLoginAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.lastLoginAt = Instant.now();
    }

    public enum AuthProvider {
        GOOGLE,
        GITHUB
    }
}
