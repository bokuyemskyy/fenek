package dev.fenek.users.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    @GetMapping("/open")
    public String openEndpoint() {
        return "Anyone can access this!";
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Map<String, Object> userData = Map.of(
                "id", principal.getAttribute("id"),
                "email", principal.getAttribute("email"),
                "displayName", principal.getAttribute("name"));

        return ResponseEntity.ok(userData);
    }
}