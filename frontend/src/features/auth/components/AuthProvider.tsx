import type { PropsWithChildren } from 'react'
import { createContext, useMemo, useState } from 'react'

import { storage } from '../../../utils/storage'
import type { LoginResponse, UserRole } from '../types'

interface AuthContextValue {
  accessToken: string | null
  tenantId: string | null
  username: string | null
  role: UserRole | null
  userId: string | null
  isAuthenticated: boolean
  isSuperAdmin: boolean
  setAuthSession: (response: LoginResponse, tenantId?: string | null) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null>(storage.getAccessToken())
  const [tenantId, setTenantId] = useState<string | null>(storage.getTenantId())
  const [username, setUsername] = useState<string | null>(storage.getUsername())
  const [role, setRole] = useState<UserRole | null>(storage.getRole() as UserRole | null)
  const [userId, setUserId] = useState<string | null>(storage.getUserId())

  const setAuthSession = (response: LoginResponse, nextTenantId?: string | null) => {
    storage.setAccessToken(response.accessToken)
    storage.setUsername(response.username)
    storage.setRole(response.role)
    if (response.userId) {
      storage.setUserId(response.userId)
    } else {
      storage.removeUserId()
    }

    if (nextTenantId) {
      storage.setTenantId(nextTenantId)
    } else {
      storage.removeTenantId()
    }

    setAccessToken(response.accessToken)
    setTenantId(nextTenantId ?? null)
    setUsername(response.username)
    setRole(response.role)
    setUserId(response.userId ?? null)
  }

  const logout = () => {
    storage.clearAuth()
    setAccessToken(null)
    setTenantId(null)
    setUsername(null)
    setRole(null)
    setUserId(null)
  }

  const value = useMemo(
    () => ({
      accessToken,
      tenantId,
      username,
      role,
      userId,
      isAuthenticated: Boolean(accessToken && role),
      isSuperAdmin: role === 'SUPER_ADMIN',
      setAuthSession,
      logout,
    }),
    [accessToken, role, tenantId, userId, username],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
