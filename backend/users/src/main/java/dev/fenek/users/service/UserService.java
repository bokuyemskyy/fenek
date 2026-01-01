package dev.fenek.users.service;

import dev.fenek.users.model.User.Provider;
import dev.fenek.users.dto.OAuth2UserInfo;
import dev.fenek.users.dto.UserResponse;
import dev.fenek.users.model.User;
import dev.fenek.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserEventPublisherService publisher;
    private final FileStorageService fileStorageService;

    public List<UserResponse> searchUsersByUsername(UUID requesterId, String query) {
        return userRepository
                .findByUsernameContainingIgnoreCase(query)
                .stream()
                .filter(user -> !user.getId().equals(requesterId))
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getDisplayName(),
                        user.getColor(),
                        fileStorageService.getAvatarUrl(user.getId(), user.getAvatarVersion())))
                .toList();
    }

    @Transactional
    public User findOrCreateUser(
            Provider provider,
            OAuth2UserInfo userInfo) {

        return userRepository
                .findByProviderAndProviderId(provider, userInfo.providerId())
                .map(existing -> {
                    return updateFromOAuth2(existing, userInfo);
                })
                .orElseGet(() -> {
                    userRepository.findByEmail(userInfo.email())
                            .ifPresent(existing -> {
                                if (!existing.getProvider().equals(provider)) {
                                    throw new OAuth2AuthenticationException(
                                            new OAuth2Error("email_exists"),
                                            "Email already registered with another provider");
                                }
                            });
                    User created = createFromOAuth2(provider, userInfo);
                    publisher.publishUserCreated(created);
                    return created;
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
        if (!user.getEmail().equals(info.email())) {
            userRepository.findByEmail(info.email())
                    .ifPresent(existing -> {
                        throw new OAuth2AuthenticationException(
                                new OAuth2Error("email_exists"),
                                "Email already registered with another provider");
                    });
        }

        user.setEmail(info.email());
        return user;
    }

    public List<UserResponse> getUsersByIds(UUID requesterId, List<UUID> userIds) {
        List<User> users = userRepository.findAllById(userIds);

        return users.stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getDisplayName(),
                        user.getColor(),
                        fileStorageService.getAvatarUrl(user.getId(), user.getAvatarVersion())))
                .toList();
    }

    public void updateUser(UUID userId,
            String username,
            String displayName,
            String color,
            Boolean removeAvatar,
            MultipartFile avatarFile) throws IOException {
        if (Boolean.TRUE.equals(removeAvatar) && avatarFile != null) {
            throw new IllegalArgumentException("Cannot remove and upload avatar at the same time");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (username != null)
            user.setUsername(username);
        if (displayName != null)
            user.setDisplayName(displayName);
        if (color != null)
            user.setColor(color);

        if (Boolean.TRUE.equals(removeAvatar)) {
            user.setAvatarVersion(null);
        }
        if (avatarFile != null) {
            Integer avatarVersion = user.getAvatarVersion() != null ? user.getAvatarVersion() + 1 : 1;
            fileStorageService.uploadAvatar(userId, avatarVersion, avatarFile.getBytes());
            user.setAvatarVersion(avatarVersion);
        }

        user.setComplete(true);

        userRepository.save(user);
    }

}