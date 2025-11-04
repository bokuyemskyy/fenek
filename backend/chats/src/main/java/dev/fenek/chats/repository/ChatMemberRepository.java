package dev.fenek.chats.repository;

import dev.fenek.chats.model.ChatMember;
import dev.fenek.chats.model.ChatMemberId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMemberRepository extends JpaRepository<ChatMember, ChatMemberId> {
    List<ChatMember> findByChatId(Long chatId);

    ChatMember findByChatIdAndUserId(Long chatId, UUID userId);

    void deleteByChatId(Long chatId);

    List<ChatMember> findByUserId(UUID userId);
}