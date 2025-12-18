package dev.fenek.users.auth;

import org.springframework.security.oauth2.core.user.OAuth2User;

public final class OAuthUserInfoFactory {

    public static OAuthUserInfo from(
            String registrationId,
            OAuth2User oAuth2User) {
        return switch (registrationId) {
            case "google" -> fromGoogle(oAuth2User);
            case "github" -> fromGithub(oAuth2User);
            default -> throw new IllegalArgumentException(
                    "Unsupported provider: " + registrationId);
        };
    }

    private static OAuthUserInfo fromGoogle(OAuth2User user) {
        return new OAuthUserInfo(
                user.getAttribute("sub"),
                user.getAttribute("email"),
                user.getAttribute("name"));
    }

    private static OAuthUserInfo fromGithub(OAuth2User user) {
        Object id = user.getAttribute("id");

        String providerId = switch (id) {
            case Integer i -> i.toString();
            case Long l -> l.toString();
            case String s -> s;
            default -> throw new IllegalStateException(
                    "Unexpected GitHub id type: " + id.getClass());
        };

        return new OAuthUserInfo(
                providerId,
                user.getAttribute("email"),
                user.getAttribute("login"));
    }
}