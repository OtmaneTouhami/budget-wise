package com.budgetwise.api.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DateFormatValidator.class)
public @interface ValidDateFormat {
    String message() default "Invalid date format. Must be one of the allowed values.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
