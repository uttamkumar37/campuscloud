import { useQuery } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'

import { getAttendanceByDate, markAttendance } from '../api/attendanceApi'
import type { MarkAttendanceRequest } from '../types'

export function useAttendanceByDate(date: string) {
  return useQuery({
    queryKey: queryKeys.attendanceByDate(date),
    queryFn: () => getAttendanceByDate(date),
    enabled: date.length === 10,
  })
}

export function useMarkAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: MarkAttendanceRequest) => markAttendance(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendanceByDate(variables.attendanceDate) })
    },
  })
}
