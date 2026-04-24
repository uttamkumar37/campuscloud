import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { ApiResponse } from '../../../types/api'

import type { LoginRequest, LoginResponse } from '../types'

export async function login(payload: LoginRequest) {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    ENDPOINTS.auth.login,
    {
      username: payload.username,
      password: payload.password,
    },
    payload.tenantId
      ? {
          headers: {
            'X-Tenant-ID': payload.tenantId,
          },
        }
      : undefined,
  )

  return data
}
