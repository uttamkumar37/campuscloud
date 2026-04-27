package com.campuscloud.subscription.dto;

import com.campuscloud.subscription.entity.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record RecordPaymentRequest(
        @NotBlank(message = "tenantId is required")
        String tenantId,

        UUID subscriptionId,

        @NotNull(message = "amount is required")
        @DecimalMin(value = "0.01", message = "amount must be positive")
        BigDecimal amount,

        @NotNull(message = "paymentDate is required")
        LocalDate paymentDate,

        @NotNull(message = "paymentMethod is required")
        PaymentMethod paymentMethod,

        @Size(max = 100, message = "referenceNo must be at most 100 characters")
        String referenceNo,

        @Size(max = 500, message = "notes must be at most 500 characters")
        String notes
) {}
