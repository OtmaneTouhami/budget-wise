package com.budgetwise.api.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CategoryTypeValidator.class)
public @interface ValidCategoryType {
    String message() default "Invalid category type. Must be 'INCOME' or 'EXPENSE'.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}