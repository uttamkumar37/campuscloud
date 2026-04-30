import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { ApiResponse } from '../../../types/api'

import type { CreateTimetableSlotRequest, TimetableSlot } from '../types'

export async function createTimetableSlot(payload: CreateTimetableSlotRequest) {
  const { data } = await apiClient.post<ApiResponse<TimetableSlot>>(ENDPOINTS.timetable.slots, payload)
  return data
}

export async function getTimetable(classId: string, sectionId: string) {
  const { data } = await apiClient.get<ApiResponse<TimetableSlot[]>>(
    ENDPOINTS.timetable.byClassSection(classId, sectionId),
  )
  return data
}
