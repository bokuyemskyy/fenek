package dev.fenek.chats.model;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;

@Entity
@Table(name = "message_reactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageReaction {
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    @JoinColumn(updatable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Message message;

    @Column(nullable = false, updatable = false)
    private UUID userId;

    @Column(nullable = false)
    private String reaction;
}
