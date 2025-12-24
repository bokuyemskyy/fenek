package dev.fenek.users.repository;

import dev.fenek.users.model.User;
import dev.fenek.users.model.User.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

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
}