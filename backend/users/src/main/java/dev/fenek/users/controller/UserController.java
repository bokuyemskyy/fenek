package dev.fenek.users.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import dev.fenek.users.dto.UserMeResponse;
import dev.fenek.users.model.User;

@RestController
@RequestMapping("/users")
public class UserController {

    @GetMapping("/me")
    public UserMeResponse getCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        return new UserMeResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getDisplayName(),
                user.getAvatarUrl());
    }
}