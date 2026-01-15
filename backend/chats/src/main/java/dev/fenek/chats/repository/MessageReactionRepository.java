package dev.fenek.chats.repository;

import dev.fenek.chats.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MessageReactionRepository extends JpaRepository<Message, UUID> {
}