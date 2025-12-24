package dev.fenek.chats.repository;

import dev.fenek.chats.model.ChatMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMemberRepository extends JpaRepository<ChatMember, UUID> {
        List<ChatMember> findByUserId(UUID userId);

        @Query("""
                            SELECT cm
                            FROM ChatMember cm
                            WHERE cm.chat.id IN :chatIds
                              AND cm.userId <> :userId
                        """)
        List<ChatMember> findOtherMembers(
                        @Param("chatIds") List<UUID> chatIds,
                        @Param("userId") UUID userId);
}