import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'

import { getTenants } from '../api/superAdminApi'

export function useTenants() {
  return useQuery({
    queryKey: queryKeys.tenants,
    queryFn: getTenants,
  })
}
