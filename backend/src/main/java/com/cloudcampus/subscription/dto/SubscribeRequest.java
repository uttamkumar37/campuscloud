package com.cloudcampus.subscription.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record SubscribeRequest(
        @NotNull(message = "planId is required")
        UUID planId,

        @Min(value = 1, message = "durationDays must be at least 1")
        int durationDays
) {}
