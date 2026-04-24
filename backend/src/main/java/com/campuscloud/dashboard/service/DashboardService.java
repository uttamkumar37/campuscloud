package com.campuscloud.dashboard.service;

import com.campuscloud.dashboard.dto.SuperAdminDashboardSummaryResponse;
import com.campuscloud.dashboard.dto.TenantDashboardSummaryResponse;

public interface DashboardService {

    TenantDashboardSummaryResponse getTenantDashboardSummary();

    SuperAdminDashboardSummaryResponse getSuperAdminDashboardSummary();
}
