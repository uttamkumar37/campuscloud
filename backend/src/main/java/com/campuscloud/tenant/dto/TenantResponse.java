package com.campuscloud.tenant.dto;

import java.time.Instant;
import java.util.UUID;

public record TenantResponse(
        UUID id,
        String tenantId,
        String schoolName,
        String schemaName,
        String logoUrl,
        String primaryColor,
        boolean active,
        Instant createdAt
) {
}
