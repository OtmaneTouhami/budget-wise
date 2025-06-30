package com.budgetwise.api.validation;

import com.budgetwise.api.recurringtransaction.enums.ScheduleType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ScheduleTypeValidator implements ConstraintValidator<ValidScheduleType, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) return false;
        try {
            ScheduleType.valueOf(value.toUpperCase());
            return true;
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }
}