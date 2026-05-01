package com.cloudcampus.dashboard.dto;

import com.cloudcampus.tenant.dto.TenantResponse;

import java.util.List;

public record SuperAdminDashboardSummaryResponse(
        long totalTenants,
        long activeTenants,
        long tenantsCreatedThisMonth,
        long inactiveTenants,
        List<TenantResponse> newestTenants
) {
}
