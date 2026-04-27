import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../../app/queryKeys'
import { subscriptionApi } from '../api/subscriptionApi'
import type { CreatePlanRequest, SubscribeRequest, RecordPaymentRequest } from '../types'

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: queryKeys.subscriptionPlans,
    queryFn: () => subscriptionApi.getPlans().then((r) => r.data.data),
  })
}

export function useCreatePlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePlanRequest) => subscriptionApi.createPlan(data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionPlans })
    },
  })
}

export function useTenantSubscription(tenantId: string) {
  return useQuery({
    queryKey: queryKeys.tenantSubscription(tenantId),
    queryFn: () => subscriptionApi.getSubscription(tenantId).then((r) => r.data.data),
    enabled: !!tenantId,
  })
}

export function useSubscribeTenant(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SubscribeRequest) => subscriptionApi.subscribe(tenantId, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenantSubscription(tenantId) })
    },
  })
}

export function useCancelSubscription(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => subscriptionApi.cancelSubscription(tenantId).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenantSubscription(tenantId) })
    },
  })
}

export function useTenantPayments(tenantId: string) {
  return useQuery({
    queryKey: queryKeys.tenantPayments(tenantId),
    queryFn: () => subscriptionApi.getPaymentsByTenant(tenantId).then((r) => r.data.data),
    enabled: !!tenantId,
  })
}

export function useRecordPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RecordPaymentRequest) => subscriptionApi.recordPayment(data).then((r) => r.data.data),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenantPayments(vars.tenantId) })
    },
  })
}
