import { useMutation, useQueryClient } from '@tanstack/react-query'
import { linkParent, unlinkParent } from '../api/parentApi'
import type { LinkParentRequest } from '../types'

export function useLinkParent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: LinkParentRequest) => linkParent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent-children'] })
    },
  })
}

export function useUnlinkParent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (linkId: string) => unlinkParent(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent-children'] })
    },
  })
}
