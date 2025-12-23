package dev.fenek.users.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import dev.fenek.users.dto.UserMeResponse;
import dev.fenek.users.model.User;
import dev.fenek.users.service.FileStorageService;
import dev.fenek.users.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final FileStorageService fileStorageService;

    @GetMapping("/me")
    public UserMeResponse getCurrentUser(@AuthenticationPrincipal User user) {
        return new UserMeResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getDisplayName(),
                fileStorageService.getAvatarUrl(user.getId(), user.getAvatarVersion()),
                user.getColor(),
                user.isComplete());
    }

    @PatchMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfile(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String displayName,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) Boolean removeAvatar,
            @RequestPart(required = false) MultipartFile avatarFile,
            @AuthenticationPrincipal User user) {
        try {
            userService.updateUser(user.getId(), username, displayName, color, removeAvatar, avatarFile);
        } catch (java.io.IOException e) {
            return ResponseEntity.status(500).body("Error updating user profile");
        }
        return ResponseEntity.ok().build();
    }
}