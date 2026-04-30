import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'

import { createTimetableSlot, getTimetable } from '../api/timetableApi'
import type { CreateTimetableSlotRequest } from '../types'

export function useTimetable(classId: string, sectionId: string) {
  return useQuery({
    queryKey: queryKeys.timetable(classId, sectionId),
    queryFn: () => getTimetable(classId, sectionId),
    enabled: classId.length > 0 && sectionId.length > 0,
  })
}

export function useCreateTimetableSlot() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTimetableSlotRequest) => createTimetableSlot(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.timetable(variables.classId, variables.sectionId ?? ''),
      })
    },
  })
}
