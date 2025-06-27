package com.budgetwise.api.auth.mapper;


import com.budgetwise.api.auth.dto.RegisterRequest;
import com.budgetwise.api.user.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuthMapper {
    /**
     * Maps a RegisterRequest DTO to a User entity.
     * Note: This mapping intentionally ignores the password and country fields.
     * - Password must be handled separately for secure hashing.
     * - Country is a complex object that needs to be fetched from the database.
     * The service layer will handle setting these two fields.
     *
     * @param request The source RegisterRequest DTO.
     * @return The target User entity.
     */
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
