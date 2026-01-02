package dev.fenek.chats.auth;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import dev.fenek.chats.service.JwtService;
import dev.fenek.chats.service.TokenCookieService;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {
    private final JwtService jwtService;
    private final TokenCookieService tokenCookieService;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {
        if (!(request instanceof ServletServerHttpRequest servletRequest)) {
            return false;
        }

        String token = tokenCookieService
                .getAccessToken(servletRequest.getServletRequest())
                .orElse(null);
        UUID userId = jwtService.validateAndGetUserId(token).orElse(null);

        if (userId != null) {
            JwtUserPrincipal principal = new JwtUserPrincipal(userId);
            WsAuthenticationToken authentication = new WsAuthenticationToken(principal, List.of());
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);

            attributes.put("SPRING_SECURITY_CONTEXT", context);

            return true;
        }

        return false;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {
    }
}
