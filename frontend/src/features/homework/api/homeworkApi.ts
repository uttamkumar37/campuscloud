import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { ApiResponse } from '../../../types/api'

import type { CreateHomeworkRequest, HomeworkItem } from '../types'

export async function createHomework(payload: CreateHomeworkRequest) {
  const { data } = await apiClient.post<ApiResponse<HomeworkItem>>(ENDPOINTS.homework.base, payload)
  return data
}

export async function getHomeworkByClass(classId: string) {
  const { data } = await apiClient.get<ApiResponse<HomeworkItem[]>>(ENDPOINTS.homework.byClass(classId))
  return data
}
