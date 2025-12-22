package dev.fenek.users.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public void refresh(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        User user = (User) authentication.getPrincipal();

        tokenCookieService.clearTokens(response);

        String accessToken = jwtService.createToken(user);
        String refreshToken = refreshTokenService.createToken(user);

        tokenCookieService.addAccessToken(response, accessToken);
        tokenCookieService.addRefreshToken(response, refreshToken);
    }

}