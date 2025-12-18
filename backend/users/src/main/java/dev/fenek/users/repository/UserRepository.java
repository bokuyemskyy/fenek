package dev.fenek.users.repository;

import dev.fenek.users.model.User;
import dev.fenek.users.model.User.AuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByProviderAndProviderId(
            AuthProvider provider,
            String providerId);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);
}