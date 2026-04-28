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
    if (role === 'SUPER_ADMIN') return <Navigate to="/super-admin/dashboard" replace />
    if (role === 'TEACHER') return <Navigate to="/teacher/dashboard" replace />
    if (role === 'STUDENT') return <Navigate to="/student/dashboard" replace />
    if (role === 'PARENT') return <Navigate to="/parent/dashboard" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}
