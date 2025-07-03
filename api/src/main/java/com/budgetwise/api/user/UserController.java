package com.budgetwise.api.user;

import com.budgetwise.api.user.dto.ChangePasswordRequest;
import com.budgetwise.api.user.dto.UpdateProfileRequest;
import com.budgetwise.api.user.dto.UserProfileResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "Endpoints for managing user profile")
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserProfileResponse> getUserProfile() {
        return ResponseEntity.ok(userService.getUserProfile());
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateUserProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateUserProfile(request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteUserProfile() {
        userService.deleteUserProfile();
        return ResponseEntity.noContent().build();
    }
}
