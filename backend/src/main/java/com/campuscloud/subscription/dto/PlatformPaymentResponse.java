package com.campuscloud.subscription.dto;

import com.campuscloud.subscription.entity.PaymentMethod;
import com.campuscloud.subscription.entity.SubscriptionPaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record PlatformPaymentResponse(
        UUID id,
        String tenantId,
        UUID subscriptionId,
        BigDecimal amount,
        SubscriptionPaymentStatus status,
        LocalDate paymentDate,
        PaymentMethod paymentMethod,
        String referenceNo,
        String notes,
        Instant createdAt
) {}
