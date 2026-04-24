import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { ApiResponse } from '../../../types/api'

import type { TenantDashboardSummary } from '../types'

export async function getTenantDashboardSummary() {
  const { data } = await apiClient.get<ApiResponse<TenantDashboardSummary>>(
    ENDPOINTS.dashboard.tenantSummary,
  )

  return data
}
