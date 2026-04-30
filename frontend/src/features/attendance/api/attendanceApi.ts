import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { ApiResponse } from '../../../types/api'

import type { AttendanceRecord, MarkAttendanceRequest } from '../types'

export async function markAttendance(payload: MarkAttendanceRequest) {
  const { data } = await apiClient.post<ApiResponse<AttendanceRecord>>(
    ENDPOINTS.attendances.base,
    payload,
  )
  return data
}

export async function getAttendanceByDate(date: string) {
  const { data } = await apiClient.get<ApiResponse<AttendanceRecord[]>>(
    ENDPOINTS.attendances.base,
    { params: { date } },
  )
  return data
}
