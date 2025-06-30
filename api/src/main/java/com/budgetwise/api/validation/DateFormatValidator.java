package com.budgetwise.api.validation;

import com.budgetwise.api.user.enums.DateFormat;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class DateFormatValidator implements ConstraintValidator<ValidDateFormat, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true; // We allow null/blank values, @NotBlank should be used for required fields
        }
        return DateFormat.isValidPattern(value);
    }
}