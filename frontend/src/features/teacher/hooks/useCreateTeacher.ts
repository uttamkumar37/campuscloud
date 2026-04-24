import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createTeacher } from '../api/teacherApi'

export function useCreateTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}
