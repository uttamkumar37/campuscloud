package com.campuscloud.subscription.dto;

import com.campuscloud.subscription.entity.PlanFeature;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record SubscriptionPlanResponse(
        UUID id,
        String name,
        BigDecimal price,
        int billingCycleDays,
        int maxStudents,
        int maxTeachers,
        String description,
        boolean active,
        Set<PlanFeature> features,
        Instant createdAt
) {}
