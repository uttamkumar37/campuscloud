export interface Tenant {
  id: string
  tenantId: string
  schoolName: string
  schemaName: string
  logoUrl: string | null
  primaryColor: string
  active: boolean
  createdAt: string
}

export interface CreateTenantRequest {
  tenantId: string
  schoolName: string
  schemaName: string
  logoUrl: string
  primaryColor: string
}

export interface SuperAdminDashboardSummary {
  totalTenants: number
  activeTenants: number
  tenantsCreatedThisMonth: number
  inactiveTenants: number
  newestTenants: Tenant[]
}
