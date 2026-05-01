package com.cloudcampus.user.dto;

import com.cloudcampus.user.entity.UserRole;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String fullName,
        String username,
        String email,
        UserRole role,
        boolean active,
        Instant createdAt
) {
}
