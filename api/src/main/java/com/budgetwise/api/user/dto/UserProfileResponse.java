package com.budgetwise.api.user.dto;

import com.budgetwise.api.global.dto.CountryDto;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UserProfileResponse {
    private UUID id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String dateFormat;
    private CountryDto country;
}
