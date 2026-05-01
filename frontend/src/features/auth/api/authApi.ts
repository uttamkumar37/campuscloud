import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { ApiResponse } from '../../../types/api'

import type { ChangePasswordRequest, LoginRequest, LoginResponse, SchoolSearchResult } from '../types'

export async function login(payload: LoginRequest) {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(ENDPOINTS.auth.login, payload)

  return data
}

export async function searchSchools(query: string) {
  const { data } = await apiClient.get<ApiResponse<SchoolSearchResult[]>>(ENDPOINTS.tenants.searchSchools, {
    params: { query },
  })

  return data
}

export async function getSchoolBySlug(slug: string) {
  const { data } = await apiClient.get<ApiResponse<SchoolSearchResult>>(
    `${ENDPOINTS.tenants.searchSchools}/${slug}`,
  )

  return data
}

export async function changePassword(payload: ChangePasswordRequest) {
  const { data } = await apiClient.post<ApiResponse<null>>(ENDPOINTS.auth.changePassword, payload)
  return data
}
