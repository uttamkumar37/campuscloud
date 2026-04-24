import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'

import { getTenantDashboardSummary } from '../api/dashboardApi'

export function useTenantDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.tenantDashboardSummary,
    queryFn: getTenantDashboardSummary,
  })
}
