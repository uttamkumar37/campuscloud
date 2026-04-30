import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { ApiResponse } from '../../../types/api'

import type { Child } from '../types'

export async function getMyChildren() {
  const { data } = await apiClient.get<ApiResponse<Child[]>>(ENDPOINTS.parent.myChildren)
  return data
}
