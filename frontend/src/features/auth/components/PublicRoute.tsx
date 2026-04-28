import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

export function PublicRoute({ children }: PropsWithChildren) {
  const { isAuthenticated, role } = useAuth()

  if (isAuthenticated) {
    if (role === 'SUPER_ADMIN') return <Navigate to="/super-admin/dashboard" replace />
    if (role === 'TEACHER') return <Navigate to="/teacher/dashboard" replace />
    if (role === 'STUDENT') return <Navigate to="/student/dashboard" replace />
    if (role === 'PARENT') return <Navigate to="/parent/dashboard" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}
