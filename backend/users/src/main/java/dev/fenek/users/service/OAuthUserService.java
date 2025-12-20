package dev.fenek.users.service;

import dev.fenek.users.auth.AuthProvider;
import dev.fenek.users.auth.OAuthUserInfo;
import dev.fenek.users.model.User;
import dev.fenek.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OAuthUserService {

    private final UserRepository userRepository;

    @Transactional
    public User findOrCreate(
            AuthProvider provider,
            OAuthUserInfo userInfo) {
        return userRepository
                .findByProviderAndProviderId(provider, userInfo.providerId())
                .map(existing -> updateFromOAuth(existing, userInfo))
                .orElseGet(() -> createFromOAuth(provider, userInfo));
    }

    private User createFromOAuth(
            AuthProvider provider,
            OAuthUserInfo info) {
        return userRepository.save(
                User.builder()
                        .provider(provider)
                        .providerId(info.providerId())
                        .email(info.email())
                        .displayName(info.name())
                        .build());
    }

    private User updateFromOAuth(
            User user,
            OAuthUserInfo info) {
        user.setDisplayName(info.name());
        return user;
    }
}