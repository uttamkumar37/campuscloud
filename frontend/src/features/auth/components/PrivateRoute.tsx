import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types'

interface PrivateRouteProps extends PropsWithChildren {
  allowedRoles?: UserRole[]
  loginPath?: string
}

export function PrivateRoute({
  children,
  allowedRoles,
  loginPath = '/login',
}: PrivateRouteProps) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'SUPER_ADMIN' ? '/super-admin/dashboard' : '/dashboard'} replace />
  }

  return children
}
