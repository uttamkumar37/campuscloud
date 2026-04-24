import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'

import { createTenant } from '../api/superAdminApi'

export function useCreateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.tenants })
      void queryClient.invalidateQueries({ queryKey: queryKeys.superAdminDashboardSummary })
    },
  })
}
