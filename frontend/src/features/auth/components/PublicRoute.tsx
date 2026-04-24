import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

export function PublicRoute({ children }: PropsWithChildren) {
  const { isAuthenticated, role } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={role === 'SUPER_ADMIN' ? '/super-admin/dashboard' : '/dashboard'} replace />
  }

  return children
}
