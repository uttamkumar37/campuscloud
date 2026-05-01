package com.cloudcampus.tenant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record TenantCreateRequest(
        @NotBlank(message = "tenantId is required")
        @Size(max = 50, message = "tenantId must be at most 50 characters")
        @Pattern(regexp = "^[a-z0-9_-]+$", message = "tenantId must contain lowercase letters, numbers, underscore or hyphen")
        String tenantId,

        @Size(max = 80, message = "slug must be at most 80 characters")
        @Pattern(regexp = "^$|^[a-z0-9-]+$", message = "slug must contain lowercase letters, numbers or hyphen")
        String slug,

        @NotBlank(message = "schoolName is required")
        @Size(max = 150, message = "schoolName must be at most 150 characters")
        String schoolName,

        @Size(max = 63, message = "schemaName must be at most 63 characters")
        @Pattern(regexp = "^$|^[a-z0-9_]+$", message = "schemaName must contain lowercase letters, numbers or underscore")
        String schemaName,

        @Size(max = 500, message = "logoUrl must be at most 500 characters")
        @Pattern(
                regexp = "^$|^(https?://).+",
                message = "logoUrl must be a valid http or https URL"
        )
        String logoUrl,

        @NotBlank(message = "primaryColor is required")
        @Pattern(
                regexp = "^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})$",
                message = "primaryColor must be a valid hex color"
        )
        String primaryColor
) {
}
