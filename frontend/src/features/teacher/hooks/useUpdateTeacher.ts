import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTeacher } from '../api/teacherApi'
import type { UpdateTeacherRequest } from '../types'

export function useUpdateTeacher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTeacherRequest }) =>
      updateTeacher(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}
