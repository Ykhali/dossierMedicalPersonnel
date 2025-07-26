package com.example.backend.validation;

import jakarta.persistence.Table;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)//to specify where we gonna apply this annotation
@Retention(RetentionPolicy.RUNTIME)//to specify where this annotation is applied
@Constraint(validatedBy = LowercaseValidator.class)
public @interface Lowercase {
    String message() default "doit être en minuscule";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
