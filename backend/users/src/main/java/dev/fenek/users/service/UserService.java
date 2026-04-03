package dev.fenek.users.service;

import dev.fenek.users.model.User.Provider;
import dev.fenek.users.dto.OAuth2UserInfo;
import dev.fenek.users.dto.UserResponse;
import dev.fenek.users.model.User;
import dev.fenek.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EventPublisher publisher;
    private final FileStorageService fileStorageService;
    private final StringRedisTemplate redisTemplate;

    private static final String USER_PRESENCE_PREFIX = "user:presence:";

    @Transactional
    public void updateLoginTimestamps(UUID userId) {
        Instant now = Instant.now();
        userRepository.updateLastLogin(userId, now);
        userRepository.updateLastSeen(userId, now);
    }

    public List<UserResponse> searchUsersByUsername(UUID requesterId, String query) {
        List<UUID> userIds = userRepository.findByUsernameContainingIgnoreCaseAndIdNot(query, requesterId).stream()
                .map(User::getId)
                .toList();

        return getUsersByIds(requesterId, userIds);
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
        if (users.isEmpty())
            return List.of();

        List<String> redisKeys = users.stream()
                .map(user -> USER_PRESENCE_PREFIX + user.getId())
                .toList();

        List<String> presenceData = redisTemplate.opsForValue().multiGet(redisKeys);
        Instant now = Instant.now();

        List<UserResponse> responses = new ArrayList<>(users.size());
        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            boolean isOnline = presenceData != null && presenceData.get(i) != null;

            responses.add(UserResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .displayName(user.getDisplayName())
                    .color(user.getColor())
                    .avatarUrl(fileStorageService.getAvatarUrl(user.getId(), user.getAvatarVersion()))
                    .lastSeenAt(isOnline ? now : user.getLastSeenAt())
                    .online(isOnline)
                    .build());
        }

        return responses;
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

        publisher.publishUserUpdated(user);
    }

}