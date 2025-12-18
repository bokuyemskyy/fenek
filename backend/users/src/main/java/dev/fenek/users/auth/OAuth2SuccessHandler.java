package dev.fenek.users.auth;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import dev.fenek.users.model.User;
import dev.fenek.users.model.User.AuthProvider;
import dev.fenek.users.service.OAuthUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

        private final OAuthUserService oAuthUserService;
        private final JwtService jwtService;

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

                OAuthUserInfo userInfo = OAuthUserInfoFactory.from(registrationId, oAuth2User);

                User user = oAuthUserService.findOrCreate(provider, userInfo);

                String accessToken = jwtService.generate(user);

                String redirectUrl = UriComponentsBuilder
                                .fromUriString(frontendUrl)
                                .path("/auth/callback")
                                .queryParam("token", accessToken)
                                .build()
                                .toUriString();

                response.sendRedirect(redirectUrl);
        }
}