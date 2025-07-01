package com.budgetwise.api.auth.mapper;


import com.budgetwise.api.auth.dto.RegisterRequest;
import com.budgetwise.api.user.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING)
public interface AuthMapper {

    @Mapping(target = "id", ignore = true) // Never map IDs for creation
    @Mapping(target = "password", ignore = true) // Handled separately for hashing
    @Mapping(target = "country", ignore = true) // Handled separately by fetching from DB
    @Mapping(target = "categories", ignore = true) // Ignore collections
    @Mapping(target = "budgets", ignore = true)
    @Mapping(target = "transactionTemplates", ignore = true)
    @Mapping(target = "recurringTransactions", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "createdAt", ignore = true) // Database will generate these
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "lastLoginDate", ignore = true)
    @Mapping(target = "lastPasswordResetDate", ignore = true)
    @Mapping(target = "isActive", ignore = true) // We will set defaults in the service
    @Mapping(target = "isDeleted", ignore = true)
    User toUser(RegisterRequest request);
}
