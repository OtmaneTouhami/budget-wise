package com.budgetwise.api.user.mapper;

import com.budgetwise.api.user.User;
import com.budgetwise.api.user.dto.UserProfileResponse;
import org.mapstruct.Mapper;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING)
public interface UserMapper {
    UserProfileResponse toUserProfileResponse(User user);
}