package dev.fenek.chats.repository;

import dev.fenek.chats.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<Chat, UUID> {
    boolean existsByOwnerIdAndType(UUID ownerId, Chat.Type type);

    @Query("""
                SELECT c FROM Chat c
                JOIN ChatMember m1 ON c.id = m1.chat.id
                JOIN ChatMember m2 ON c.id = m2.chat.id
                WHERE c.type = 'PRIVATE'
                AND m1.userId = :userId1
                AND m2.userId = :userId2
            """)
    Optional<Chat> findPrivateChatBetweenUsers(
            @Param("userId1") UUID userId1,
            @Param("userId2") UUID userId2);
}