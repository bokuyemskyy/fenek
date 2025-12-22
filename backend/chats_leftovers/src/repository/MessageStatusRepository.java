package dev.fenek.chats.repository;

import dev.fenek.chats.model.MessageStatus;
import dev.fenek.chats.model.MessageStatusId;
import dev.fenek.chats.model.MessageStatus.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageStatusRepository extends JpaRepository<MessageStatus, MessageStatusId> {
    List<MessageStatus> findByMessageId(Long messageId);

    List<MessageStatus> findByUserId(UUID userId);

    List<MessageStatus> findByUserIdAndStatus(UUID userId, Status status);
}
