package com.cloudcampus.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank(message = "currentPassword is required")
        String currentPassword,

        @NotBlank(message = "newPassword is required")
        @Size(min = 8, max = 64, message = "newPassword must be between 8 and 64 characters")
        String newPassword
) {
}
