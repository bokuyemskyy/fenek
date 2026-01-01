package dev.fenek.users.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import dev.fenek.users.model.RefreshToken;
import dev.fenek.users.model.User;
import dev.fenek.users.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.jwt.refresh-expiration-seconds}")
    private int expirationSeconds;

    private final SecureRandom secureRandom = new SecureRandom();
    private final Base64.Encoder base64Encoder = Base64.getEncoder();

    public int getExpirationSeconds() {
        return expirationSeconds;
    }

    @Transactional
    public String createToken(User user) {
        String rawToken = generateRandomToken();
        String hashedToken = hashToken(rawToken);
        RefreshToken token = RefreshToken.builder()
                .user(user)
                .tokenHash(hashedToken)
                .expiresAt(Instant.now().plusSeconds(expirationSeconds))
                .build();
        refreshTokenRepository.save(token);
        return rawToken;
    }

    @Transactional
    public void revokeToken(String rawToken) {
        String hashedToken = hashToken(rawToken);

        RefreshToken token = refreshTokenRepository.findByTokenHash(hashedToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        token.setRevokedAt(Instant.now());
        refreshTokenRepository.save(token);
    }

    private String generateRandomToken() {
        byte[] randomBytes = new byte[64];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

    private String hashToken(String token) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(token.getBytes(StandardCharsets.UTF_8));
            return base64Encoder.encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public User validateAndGetUser(String rawToken) {
        String hashed = hashToken(rawToken);

        RefreshToken token = refreshTokenRepository.findByTokenHash(hashed)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (!token.isActive()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token is expired or revoked");
        }

        return token.getUser();
    }

    @Transactional
    public String rotateToken(String oldRawToken) {
        String hashed = hashToken(oldRawToken);
        RefreshToken oldToken = refreshTokenRepository.findByTokenHash(hashed)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        oldToken.setRevokedAt(Instant.now());
        refreshTokenRepository.save(oldToken);

        return createToken(oldToken.getUser());
    }

    @Transactional
    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteExpiredTokens() {
        refreshTokenRepository.deleteByExpiresAtBefore(Instant.now());
    }
}
