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
  attendances: {
    base: '/attendances',
    byId: (id: string) => `/attendances/${id}`,
  },
  fees: {
    assignments: '/fees/assignments',
    payments: '/fees/payments',
    studentAssignments: (studentId: string) => `/fees/students/${studentId}/assignments`,
  },
  exams: {
    base: '/exams',
    byClass: (classId: string) => `/exams/classes/${classId}`,
    results: '/exams/results',
    resultsByExam: (examId: string) => `/exams/${examId}/results`,
  },
  homework: {
    base: '/homework',
    byClass: (classId: string) => `/homework/classes/${classId}`,
  },
  timetable: {
    slots: '/timetable/slots',
    byClassSection: (classId: string, sectionId: string) =>
      `/timetable/classes/${classId}/sections/${sectionId}`,
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
