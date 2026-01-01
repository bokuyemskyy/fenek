package dev.fenek.users.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import dev.fenek.users.service.TokenCookieService;
import dev.fenek.users.model.User;
import dev.fenek.users.service.JwtService;
import dev.fenek.users.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final TokenCookieService tokenCookieService;

    @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        tokenCookieService.clearTokens(response);
        tokenCookieService.getRefreshToken(request)
                .ifPresent(refreshTokenService::revokeToken);
    }

    @PostMapping("/refresh")
    public void refresh(@CookieValue(value = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {

        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token is missing");
        }

        User user = refreshTokenService.validateAndGetUser(refreshToken);

        tokenCookieService.clearTokens(response);

        String newAccessToken = jwtService.createToken(user);
        String newRefreshToken = refreshTokenService.createToken(user);

        tokenCookieService.addAccessToken(response, newAccessToken);
        tokenCookieService.addRefreshToken(response, newRefreshToken);
    }

}