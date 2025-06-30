package com.budgetwise.api.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ScheduleTypeValidator.class)
public @interface ValidScheduleType {
    String message() default "Invalid schedule type. Must be 'DAILY', 'WEEKLY', 'MONTHLY', or 'YEARLY'.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}