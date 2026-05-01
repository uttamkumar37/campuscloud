import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { ApiResponse } from '../../../types/api'
import type {
  SubscriptionPlan,
  CreatePlanRequest,
  SubscribeRequest,
  TenantSubscription,
  RecordPaymentRequest,
  PlatformPayment,
  InitiatePaymentResponse,
} from '../types'

export const subscriptionApi = {
  getPlans: () =>
    apiClient.get<ApiResponse<SubscriptionPlan[]>>(ENDPOINTS.plans.base),

  createPlan: (data: CreatePlanRequest) =>
    apiClient.post<ApiResponse<SubscriptionPlan>>(ENDPOINTS.plans.base, data),

  subscribe: (tenantId: string, data: SubscribeRequest) =>
    apiClient.post<ApiResponse<TenantSubscription>>(ENDPOINTS.subscriptions.subscribe(tenantId), data),

  initiatePayment: (tenantId: string) =>
    apiClient.post<ApiResponse<InitiatePaymentResponse>>(ENDPOINTS.subscriptions.initiate(tenantId), {}),

  getSubscription: (tenantId: string) =>
    apiClient.get<ApiResponse<TenantSubscription | null>>(ENDPOINTS.subscriptions.get(tenantId)),

  cancelSubscription: (tenantId: string) =>
    apiClient.delete<ApiResponse<TenantSubscription>>(ENDPOINTS.subscriptions.cancel(tenantId)),

  recordPayment: (data: RecordPaymentRequest) =>
    apiClient.post<ApiResponse<PlatformPayment>>(ENDPOINTS.payments.base, data),

  getPaymentsByTenant: (tenantId: string) =>
    apiClient.get<ApiResponse<PlatformPayment[]>>(ENDPOINTS.payments.byTenant(tenantId)),
}
