package com.cloudcampus.parent.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record LinkParentRequest(
        @NotNull(message = "parentUserId is required") UUID parentUserId,
        @NotNull(message = "studentId is required") UUID studentId
) {
}
