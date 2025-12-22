package dev.fenek.users.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenCookieService {
    private final CookieService cookieService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    private int expirationSeconds;
    private int refreshExpirationSeconds;

    @PostConstruct
    public void init() {
        this.expirationSeconds = jwtService.getExpirationSeconds();
        this.refreshExpirationSeconds = refreshTokenService.getExpirationSeconds();
    }

    public void addAccessToken(HttpServletResponse response, String accessToken) {
        cookieService.add(response, "accessToken", accessToken, expirationSeconds, true);
    }

    public void addRefreshToken(HttpServletResponse response, String refreshToken) {
        cookieService.add(response, "refreshToken", refreshToken, refreshExpirationSeconds,
                true);
    }

    public void clearRefreshToken(HttpServletResponse response) {
        cookieService.clear(response, "refreshToken");
    }

    public void clearAccessToken(HttpServletResponse response) {
        cookieService.clear(response, "accessToken");
    }

    public void clearTokens(HttpServletResponse response) {
        clearAccessToken(response);
        clearRefreshToken(response);
    }

    public Optional<String> getRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    String rawToken = cookie.getValue();
                    return Optional.of(rawToken);
                }
            }
        }

        return Optional.empty();
    }

    public Optional<String> getAccessToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    String rawToken = cookie.getValue();
                    return Optional.of(rawToken);
                }
            }
        }

        return Optional.empty();
    }

}
