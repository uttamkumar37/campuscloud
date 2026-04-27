export const API_BASE_URL = 'http://localhost:8080/api/v1'

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
  },
  dashboard: {
    tenantSummary: '/dashboard/tenant-summary',
    superAdminSummary: '/dashboard/super-admin-summary',
  },
  bulk: {
    upload: '/bulk/upload',
    sample: '/bulk/sample',
  },
  tenants: {
    base: '/tenants',
  },
  users: {
    base: '/users',
  },
  students: {
    base: '/students',
  },
  teachers: {
    base: '/teachers',
  },
  academic: {
    base: '/academics',
  },
  homework: {
    base: '/homework',
  },
  timetable: {
    base: '/timetable',
  },
  parent: {
    myChildren: '/parents/me/children',
  },
  plans: {
    base: '/plans',
    byId: (id: string) => `/plans/${id}`,
  },
  subscriptions: {
    subscribe: (tenantId: string) => `/tenants/${tenantId}/subscribe`,
    get: (tenantId: string) => `/tenants/${tenantId}/subscription`,
    cancel: (tenantId: string) => `/tenants/${tenantId}/subscription`,
  },
  payments: {
    base: '/payments',
    byTenant: (tenantId: string) => `/payments/tenant/${tenantId}`,
  },
} as const
