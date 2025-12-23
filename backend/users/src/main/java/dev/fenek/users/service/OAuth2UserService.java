package dev.fenek.users.service;

import dev.fenek.users.model.User.Provider;
import dev.fenek.users.dto.OAuth2LoginResult;
import dev.fenek.users.dto.OAuth2UserInfo;
import dev.fenek.users.model.User;
import dev.fenek.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OAuth2UserService {

    private final UserRepository userRepository;
    private final UserEventPublisherService publisher;

    @Transactional
    public OAuth2LoginResult findOrCreateUser(
            Provider provider,
            OAuth2UserInfo userInfo) {

        return userRepository
                .findByProviderAndProviderId(provider, userInfo.providerId())
                .map(existing -> {
                    User updated = updateFromOAuth2(existing, userInfo);
                    return new OAuth2LoginResult(updated, false);
                })
                .orElseGet(() -> {
                    User created = createFromOAuth2(provider, userInfo);
                    publisher.publishUserCreated(created);
                    return new OAuth2LoginResult(created, true);
                });
    }

    private User createFromOAuth2(
            Provider provider,
            OAuth2UserInfo info) {
        return userRepository.save(
                User.builder()
                        .provider(provider)
                        .providerId(info.providerId())
                        .email(info.email())
                        .displayName(info.name())
                        .build());
    }

    private User updateFromOAuth2(
            User user,
            OAuth2UserInfo info) {
        user.setEmail(info.email());
        return user;
    }
}