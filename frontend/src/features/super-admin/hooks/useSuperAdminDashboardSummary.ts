import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'

import { getSuperAdminDashboardSummary } from '../api/superAdminApi'

export function useSuperAdminDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.superAdminDashboardSummary,
    queryFn: getSuperAdminDashboardSummary,
  })
}
