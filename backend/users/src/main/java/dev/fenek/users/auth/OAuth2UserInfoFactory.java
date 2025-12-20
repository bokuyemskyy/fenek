package dev.fenek.users.auth;

import org.springframework.security.oauth2.core.user.OAuth2User;

import dev.fenek.users.dto.OAuth2UserInfo;

public final class OAuth2UserInfoFactory {

    public static OAuth2UserInfo from(
            AuthProvider provider,
            OAuth2User oAuth2User) {
        return switch (provider) {
            case GOOGLE -> fromGoogle(oAuth2User);
            case GITHUB -> fromGithub(oAuth2User);
        };
    }

    private static OAuth2UserInfo fromGoogle(OAuth2User user) {
        return new OAuth2UserInfo(
                user.getAttribute("sub"),
                user.getAttribute("email"),
                user.getAttribute("name"));
    }

    private static OAuth2UserInfo fromGithub(OAuth2User user) {
        return new OAuth2UserInfo(
                Integer.toString(user.getAttribute("id")),
                user.getAttribute("email"),
                user.getAttribute("login"));
    }
}