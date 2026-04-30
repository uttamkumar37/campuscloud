import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteTeacher } from '../api/teacherApi'

export function useDeleteTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTeacher(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}
