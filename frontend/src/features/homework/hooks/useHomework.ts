import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'

import { createHomework, getHomeworkByClass } from '../api/homeworkApi'
import type { CreateHomeworkRequest } from '../types'

export function useHomeworkByClass(classId: string) {
  return useQuery({
    queryKey: queryKeys.homeworkByClass(classId),
    queryFn: () => getHomeworkByClass(classId),
    enabled: classId.length > 0,
  })
}

export function useCreateHomework() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateHomeworkRequest) => createHomework(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homeworkByClass(variables.classId) })
    },
  })
}
