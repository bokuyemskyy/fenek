package dev.fenek.chats.repository;

import dev.fenek.chats.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<Chat, UUID> {
    boolean existsByOwnerIdAndType(UUID ownerId, Chat.Type type);
}