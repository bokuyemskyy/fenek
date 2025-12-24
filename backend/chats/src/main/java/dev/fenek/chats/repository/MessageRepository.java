package dev.fenek.chats.repository;

import dev.fenek.chats.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    Optional<Message> findTopByChatIdOrderByCreatedAtDesc(UUID chatId);

    @Query("""
                SELECT m
                FROM Message m
                WHERE m.chat.id IN :chatIds
                  AND m.createdAt = (
                      SELECT MAX(m2.createdAt)
                      FROM Message m2
                      WHERE m2.chat.id = m.chat.id
                  )
            """)
    List<Message> findLastMessagesForChats(@Param("chatIds") List<UUID> chatIds);
}