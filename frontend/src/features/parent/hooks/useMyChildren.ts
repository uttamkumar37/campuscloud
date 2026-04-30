import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'

import { getMyChildren } from '../api/parentApi'

export function useMyChildren() {
  return useQuery({
    queryKey: queryKeys.parentChildren,
    queryFn: getMyChildren,
  })
}
