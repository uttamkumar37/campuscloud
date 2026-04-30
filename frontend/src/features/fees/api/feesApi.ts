import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { ApiResponse } from '../../../types/api'

import type { AssignFeeRequest, FeeAssignment, FeePayment, RecordPaymentRequest } from '../types'

export async function assignFee(payload: AssignFeeRequest) {
  const { data } = await apiClient.post<ApiResponse<FeeAssignment>>(
    ENDPOINTS.fees.assignments,
    payload,
  )
  return data
}

export async function recordPayment(payload: RecordPaymentRequest) {
  const { data } = await apiClient.post<ApiResponse<FeePayment>>(
    ENDPOINTS.fees.payments,
    payload,
  )
  return data
}

export async function getFeeAssignments(studentId: string) {
  const { data } = await apiClient.get<ApiResponse<FeeAssignment[]>>(
    ENDPOINTS.fees.studentAssignments(studentId),
  )
  return data
}
