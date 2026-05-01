import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'
import { getStudentDashboard } from '../api/dashboardApi'

export function useStudentDashboard() {
  return useQuery({
    queryKey: queryKeys.studentDashboard,
    queryFn: getStudentDashboard,
  })
}
