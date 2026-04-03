package dev.fenek.users.repository;

import dev.fenek.users.model.User;
import dev.fenek.users.model.User.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByProviderAndProviderId(
            Provider provider,
            String providerId);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    List<User> findAllById(Iterable<UUID> ids);

    List<User> findByUsernameContainingIgnoreCase(String username);

    List<User> findByUsernameContainingIgnoreCaseAndIdNot(String username, UUID id);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.lastLoginAt = :lastLogin WHERE u.id = :userId")
    void updateLastLogin(UUID userId, Instant lastLogin);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.lastSeenAt = :lastSeen WHERE u.id = :userId")
    void updateLastSeen(UUID userId, Instant lastSeen);
}