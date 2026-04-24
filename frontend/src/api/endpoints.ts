export const API_BASE_URL = 'http://localhost:8080/api/v1'

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
  },
  dashboard: {
    tenantSummary: '/dashboard/tenant-summary',
    superAdminSummary: '/dashboard/super-admin-summary',
  },
  tenants: {
    base: '/tenants',
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
} as const
