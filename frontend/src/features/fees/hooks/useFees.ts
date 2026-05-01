import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'

import { assignFee, getFeeAssignments, recordPayment } from '../api/feesApi'
import type { AssignFeeRequest, RecordPaymentRequest } from '../types'

export function useFeeAssignments(studentId: string) {
  return useQuery({
    queryKey: queryKeys.feeAssignments(studentId),
    queryFn: () => getFeeAssignments(studentId),
    enabled: studentId.length > 0,
  })
}

export function useAssignFee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AssignFeeRequest) => assignFee(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feeAssignments(variables.studentId) })
    },
  })
}

export function useRecordPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RecordPaymentRequest) => recordPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees', 'assignments'] })
    },
  })
}
