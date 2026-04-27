export const queryKeys = {
  students: (page: number, size: number) => ['students', page, size] as const,
  teachers: (page: number, size: number) => ['teachers', page, size] as const,
  academicClasses: ['academic', 'classes'] as const,
  academicSubjects: ['academic', 'subjects'] as const,
  academicSections: ['academic', 'sections'] as const,
  tenantDashboardSummary: ['dashboard', 'tenant-summary'] as const,
  superAdminDashboardSummary: ['super-admin', 'dashboard-summary'] as const,
  tenants: ['tenants'] as const,
  subscriptionPlans: ['subscription', 'plans'] as const,
  tenantSubscription: (tenantId: string) => ['subscription', 'tenant', tenantId] as const,
  tenantPayments: (tenantId: string) => ['payments', 'tenant', tenantId] as const,
} as const
