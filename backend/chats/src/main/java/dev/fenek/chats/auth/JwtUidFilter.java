package dev.fenek.chats.auth;

import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import dev.fenek.chats.service.JwtService;
import dev.fenek.chats.service.TokenCookieService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtUidFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final TokenCookieService tokenCookieService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String token = tokenCookieService.getAccessToken(request).orElse(null);

        if (token != null) {
            UUID uid = jwtService.validateAndGetUserId(token).orElse(null);
            if (uid != null)
                request.setAttribute("uid", uid);
        }

        filterChain.doFilter(request, response);
    }

}