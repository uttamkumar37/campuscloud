import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateStudent } from '../api/studentApi'
import type { UpdateStudentRequest } from '../types'

export function useUpdateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStudentRequest }) =>
      updateStudent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}
