package com.cloudcampus.tenant.dto;

import java.time.Instant;
import java.util.UUID;

public record TenantResponse(
        UUID id,
        String tenantId,
        String slug,
        String schoolName,
        String schemaName,
        String logoUrl,
        String primaryColor,
        boolean active,
        Instant createdAt
) {
}
