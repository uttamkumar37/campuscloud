package com.campuscloud.subscription.dto;

import com.campuscloud.subscription.entity.PlanFeature;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.Set;

public record SubscriptionPlanCreateRequest(
        @NotBlank(message = "Plan name is required")
        @Size(max = 50, message = "Plan name must be at most 50 characters")
        String name,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", message = "Price must be non-negative")
        BigDecimal price,

        @Min(value = 1, message = "Billing cycle days must be at least 1")
        int billingCycleDays,

        @Min(value = -1, message = "maxStudents must be -1 (unlimited) or a positive number")
        int maxStudents,

        @Min(value = -1, message = "maxTeachers must be -1 (unlimited) or a positive number")
        int maxTeachers,

        @Size(max = 500, message = "Description must be at most 500 characters")
        String description,

        @NotNull(message = "Features list is required")
        Set<PlanFeature> features
) {}
