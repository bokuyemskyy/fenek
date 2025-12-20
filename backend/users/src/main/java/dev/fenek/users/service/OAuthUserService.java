package dev.fenek.users.service;

import dev.fenek.users.auth.AuthProvider;
import dev.fenek.users.dto.OAuth2UserInfo;
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
            OAuth2UserInfo userInfo) {
        return userRepository
                .findByProviderAndProviderId(provider, userInfo.providerId())
                .map(existing -> updateFromOAuth(existing, userInfo))
                .orElseGet(() -> createFromOAuth(provider, userInfo));
    }

    private User createFromOAuth(
            AuthProvider provider,
            OAuth2UserInfo info) {
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
            OAuth2UserInfo info) {
        user.setDisplayName(info.name());
        return user;
    }
}