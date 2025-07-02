package com.budgetwise.api.user.impl;

import com.budgetwise.api.security.SecurityUtils;
import com.budgetwise.api.user.User;
import com.budgetwise.api.user.UserRepository;
import com.budgetwise.api.user.UserService;
import com.budgetwise.api.user.dto.ChangePasswordRequest;
import com.budgetwise.api.user.dto.UpdateProfileRequest;
import com.budgetwise.api.user.dto.UserProfileResponse;
import com.budgetwise.api.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;

    @Override
    public UserProfileResponse getUserProfile() {
        User currentUser = securityUtils.getCurrentUser();
        return userMapper.toUserProfileResponse(currentUser);
    }

    @Override
    @Transactional
    public UserProfileResponse updateUserProfile(UpdateProfileRequest request) {
        User currentUser = securityUtils.getCurrentUser();

        // Update fields from DTO
        currentUser.setFirstName(request.getFirstName());
        currentUser.setLastName(request.getLastName());
        currentUser.setEmail(request.getEmail());
        currentUser.setPhoneNumber(request.getPhoneNumber());
        currentUser.setDateFormat(request.getDateFormat());

        User updatedUser = userRepository.save(currentUser);
        return userMapper.toUserProfileResponse(updatedUser);
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User currentUser = securityUtils.getCurrentUser();

        // 1. Check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new BadCredentialsException("Incorrect current password");
        }

        // 2. Check if the new password and confirmation match
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalArgumentException("New password and confirmation password do not match");
        }

        // 3. Update the password
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // 4. Set the password update timestamp
        LocalDateTime changePasswordTime = LocalDateTime.now();
        currentUser.setLastPasswordResetDate(changePasswordTime);

        // 5. Save the changes
        userRepository.save(currentUser);
    }

    @Override
    @Transactional
    public void deleteUserProfile() {
        User currentUser = securityUtils.getCurrentUser();
        currentUser.setActive(false);
        currentUser.setDeleted(true);
        userRepository.save(currentUser);
    }

}
