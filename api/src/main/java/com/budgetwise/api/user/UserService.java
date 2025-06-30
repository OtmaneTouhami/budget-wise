package com.budgetwise.api.user;

import com.budgetwise.api.user.dto.ChangePasswordRequest;
import com.budgetwise.api.user.dto.UpdateProfileRequest;
import com.budgetwise.api.user.dto.UserProfileResponse;

public interface UserService {
    UserProfileResponse getUserProfile();
    UserProfileResponse updateUserProfile(UpdateProfileRequest request);
    void changePassword(ChangePasswordRequest request);
    void deleteUserProfile();
}
