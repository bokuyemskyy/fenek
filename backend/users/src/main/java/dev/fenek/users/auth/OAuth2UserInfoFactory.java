package dev.fenek.users.auth;

import org.springframework.security.oauth2.core.user.OAuth2User;

import dev.fenek.users.dto.OAuthUserInfo;

public final class OAuth2UserInfoFactory {

    public static OAuthUserInfo from(
            AuthProvider provider,
            OAuth2User oAuth2User) {
        return switch (provider) {
            case GOOGLE -> fromGoogle(oAuth2User);
            case GITHUB -> fromGithub(oAuth2User);
        };
    }

    private static OAuthUserInfo fromGoogle(OAuth2User user) {
        return new OAuthUserInfo(
                user.getAttribute("sub"),
                user.getAttribute("email"),
                user.getAttribute("name"));
    }

    private static OAuthUserInfo fromGithub(OAuth2User user) {
        return new OAuthUserInfo(
                Integer.toString(user.getAttribute("id")),
                user.getAttribute("email"),
                user.getAttribute("login"));
    }
}