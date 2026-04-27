package com.campuscloud.subscription.dto;

import com.campuscloud.subscription.entity.SubscriptionPaymentStatus;
import com.campuscloud.subscription.entity.SubscriptionStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record TenantSubscriptionResponse(
        UUID id,
        String tenantId,
        SubscriptionPlanResponse plan,
        LocalDate startDate,
        LocalDate endDate,
        SubscriptionStatus status,
        SubscriptionPaymentStatus paymentStatus,
        Instant createdAt
) {}
