package dev.fenek.users.auth;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import dev.fenek.users.model.User;
import dev.fenek.users.repository.UserRepository;
import dev.fenek.users.service.JwtService;
import dev.fenek.users.service.TokenCookieService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final TokenCookieService tokenCookieService;
    private final UserRepository userRepository;

    @Value("${app.service-token}")
    private String serviceToken;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {
        String serviceAuth = request.getHeader("X-Service-Token");
        if (serviceAuth != null && serviceAuth.equals(serviceToken)) {
            SecurityContextHolder.getContext().setAuthentication(
                    new UsernamePasswordAuthenticationToken(
                            "SERVICE", null, List.of()));
            filterChain.doFilter(request, response);
            return;
        }

        String token = tokenCookieService.getAccessToken(request).orElse(null);
        if (token != null) {
            jwtService.validateAndGetUserId(token).ifPresent(uid -> {
                User user = userRepository.findById(uid).orElseThrow();
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(user, null, List.of()));
            });
        }
        filterChain.doFilter(request, response);
    }
}
