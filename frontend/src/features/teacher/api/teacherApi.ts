import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { ApiResponse } from '../../../types/api'
import type { PageResponse } from '../../../types/pagination'

import type { CreateTeacherRequest, Teacher } from '../types'

interface GetTeachersParams {
  page?: number
  size?: number
}

export async function getTeachers(params: GetTeachersParams = {}) {
  const { page = 0, size = 20 } = params

  const { data } = await apiClient.get<ApiResponse<PageResponse<Teacher>>>(ENDPOINTS.teachers.base, {
    params: { page, size },
  })

  return data
}

export async function createTeacher(payload: CreateTeacherRequest) {
  const { data } = await apiClient.post<ApiResponse<Teacher>>(ENDPOINTS.teachers.base, payload)
  return data
}

export async function deleteTeacher(id: string) {
  await apiClient.delete(`${ENDPOINTS.teachers.base}/${id}`)
}
