import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteStudent } from '../api/studentApi'

export function useDeleteStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}
