package dev.fenek.users.auth;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import dev.fenek.users.dto.OAuthUserInfo;
import dev.fenek.users.model.User;
import dev.fenek.users.service.JwtService;
import dev.fenek.users.service.OAuthUserService;
import dev.fenek.users.service.RefreshTokenService;
import dev.fenek.users.service.TokenCookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

        private final OAuthUserService oAuthUserService;

        private final JwtService jwtService;
        private final RefreshTokenService refreshTokenService;
        private final TokenCookieService tokenCookieService;

        @Value("${app.frontend-url}")
        private String frontendUrl;

        @Override
        public void onAuthenticationSuccess(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        Authentication authentication) throws IOException {

                OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
                String registrationId = authToken.getAuthorizedClientRegistrationId();
                OAuth2User oAuth2User = authToken.getPrincipal();
                AuthProvider provider = AuthProvider.valueOf(registrationId.toUpperCase());
                OAuthUserInfo userInfo = OAuth2UserInfoFactory.from(provider, oAuth2User);
                User user = oAuthUserService.findOrCreate(provider, userInfo);

                String accessToken = jwtService.createToken(user);
                String refreshToken = refreshTokenService.createToken(user);

                tokenCookieService.addAccessToken(response, accessToken);
                tokenCookieService.addRefreshToken(response, refreshToken);

                response.sendRedirect("/chats");
        }

}