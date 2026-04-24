import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'

import { getStudents } from '../api/studentApi'

interface UseStudentsParams {
  page?: number
  size?: number
}

export function useStudents(params: UseStudentsParams = {}) {
  const { page = 0, size = 20 } = params

  return useQuery({
    queryKey: queryKeys.students(page, size),
    queryFn: () => getStudents({ page, size }),
  })
}
