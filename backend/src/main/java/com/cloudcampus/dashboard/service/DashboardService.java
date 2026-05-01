package com.cloudcampus.dashboard.service;

import com.cloudcampus.dashboard.dto.StudentDashboardResponse;
import com.cloudcampus.dashboard.dto.SuperAdminDashboardSummaryResponse;
import com.cloudcampus.dashboard.dto.TeacherDashboardResponse;
import com.cloudcampus.dashboard.dto.TenantDashboardSummaryResponse;

public interface DashboardService {

    TenantDashboardSummaryResponse getTenantDashboardSummary();

    SuperAdminDashboardSummaryResponse getSuperAdminDashboardSummary();

    StudentDashboardResponse getStudentDashboard();

    TeacherDashboardResponse getTeacherDashboard();
}
