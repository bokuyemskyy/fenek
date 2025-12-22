package dev.fenek.users.service;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import dev.fenek.users.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Service
public class JwtService {

    @Value("${app.jwt.secret-base-64}")
    private String secret;

    @Value("${app.jwt.expiration-seconds}")
    private int expirationSeconds;

    public int getExpirationSeconds() {
        return expirationSeconds;
    }

    private byte[] secretBytes;

    @PostConstruct
    public void init() {
        secretBytes = Decoders.BASE64.decode(secret);
    }

    public String createToken(User user) {
        Instant now = Instant.now();

        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("provider", user.getProvider().name())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(expirationSeconds)))
                .signWith(Keys.hmacShaKeyFor(secretBytes))
                .compact();
    }

    public Optional<UUID> validateAndGetUserId(String token) {
        try {
            var claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secretBytes))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return Optional.of(UUID.fromString(claims.getSubject()));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
