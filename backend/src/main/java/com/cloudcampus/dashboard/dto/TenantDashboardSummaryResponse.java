package com.cloudcampus.dashboard.dto;

import java.math.BigDecimal;
import java.util.List;

public record TenantDashboardSummaryResponse(
        TenantBrandingResponse branding,
        long totalStudents,
        long totalTeachers,
        double attendancePercentage,
        BigDecimal feesCollected,
        List<MetricPointResponse> attendanceTrend,
        List<MetricPointResponse> monthlyFeeCollection,
        List<RecentActivityResponse> recentActivity,
        List<String> quickInsights
) {
}
