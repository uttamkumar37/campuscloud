import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'

import { getTeachers } from '../api/teacherApi'

interface UseTeachersParams {
  page?: number
  size?: number
}

export function useTeachers(params: UseTeachersParams = {}) {
  const { page = 0, size = 20 } = params

  return useQuery({
    queryKey: queryKeys.teachers(page, size),
    queryFn: () => getTeachers({ page, size }),
  })
}
