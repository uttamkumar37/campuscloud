import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { ApiResponse } from '../../../types/api'

import type { StudentDashboard, TeacherDashboard, TenantDashboardSummary } from '../types'

export async function getTenantDashboardSummary() {
  const { data } = await apiClient.get<ApiResponse<TenantDashboardSummary>>(
    ENDPOINTS.dashboard.tenantSummary,
  )

  return data
}

export async function getStudentDashboard() {
  const { data } = await apiClient.get<ApiResponse<StudentDashboard>>(
    ENDPOINTS.dashboard.student,
  )
  return data
}

export async function getTeacherDashboard() {
  const { data } = await apiClient.get<ApiResponse<TeacherDashboard>>(
    ENDPOINTS.dashboard.teacher,
  )
  return data
}
