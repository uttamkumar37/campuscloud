package com.campuscloud.dashboard.controller;

import com.campuscloud.common.api.ApiResponse;
import com.campuscloud.dashboard.dto.SuperAdminDashboardSummaryResponse;
import com.campuscloud.dashboard.dto.TenantDashboardSummaryResponse;
import com.campuscloud.dashboard.service.DashboardService;
import com.campuscloud.tenant.dto.TenantResponse;
import com.campuscloud.tenant.service.TenantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard and branding APIs")
public class DashboardController {

    private final DashboardService dashboardService;
    private final TenantService tenantService;

    @GetMapping("/tenant-summary")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Get tenant dashboard summary", parameters = {
            @Parameter(name = "X-Tenant-ID", description = "Tenant schema identifier", required = true),
            @Parameter(name = "Authorization", description = "Bearer JWT token", required = true)
    })
    public ResponseEntity<ApiResponse<TenantDashboardSummaryResponse>> getTenantDashboardSummary() {
        return ResponseEntity.ok(ApiResponse.success(
                "Tenant dashboard summary fetched successfully",
                dashboardService.getTenantDashboardSummary()
        ));
    }

    @GetMapping("/branding")
    @PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
    @Operation(summary = "Get current tenant branding", parameters = {
            @Parameter(name = "X-Tenant-ID", description = "Tenant schema identifier", required = true),
            @Parameter(name = "Authorization", description = "Bearer JWT token", required = true)
    })
    public ResponseEntity<ApiResponse<TenantResponse>> getTenantBranding() {
        return ResponseEntity.ok(ApiResponse.success(
                "Tenant branding fetched successfully",
                tenantService.getCurrentTenant()
        ));
    }

    @GetMapping("/super-admin-summary")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get super admin dashboard summary", parameters = {
            @Parameter(name = "Authorization", description = "Bearer JWT token", required = true)
    })
    public ResponseEntity<ApiResponse<SuperAdminDashboardSummaryResponse>> getSuperAdminDashboardSummary() {
        return ResponseEntity.ok(ApiResponse.success(
                "Super admin dashboard summary fetched successfully",
                dashboardService.getSuperAdminDashboardSummary()
        ));
    }
}
