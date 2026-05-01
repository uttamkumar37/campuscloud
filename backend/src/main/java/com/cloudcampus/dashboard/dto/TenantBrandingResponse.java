package com.cloudcampus.dashboard.dto;

public record TenantBrandingResponse(
        String tenantId,
        String schoolName,
        String logoUrl,
        String primaryColor
) {
}
