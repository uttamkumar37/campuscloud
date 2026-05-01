import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'
import { getTeacherDashboard } from '../api/dashboardApi'

export function useTeacherDashboard() {
  return useQuery({
    queryKey: queryKeys.teacherDashboard,
    queryFn: getTeacherDashboard,
  })
}
