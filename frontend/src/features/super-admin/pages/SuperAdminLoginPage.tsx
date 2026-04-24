import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../auth/hooks/useAuth'
import { useLogin } from '../../auth/hooks/useLogin'

export function SuperAdminLoginPage() {
  const navigate = useNavigate()
  const { setAuthSession } = useAuth()
  const loginMutation = useLogin()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const response = await loginMutation.mutateAsync({ username, password })
      if (!response.success) {
        setError(response.message)
        return
      }

      setAuthSession(response.data, null)
      navigate('/super-admin/dashboard', { replace: true })
    } catch {
      setError('Unable to sign in as super admin. Please verify your credentials.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-[34px] border border-white/10 bg-white/5 p-8 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">CampusCloud</p>
        <h1 className="mt-4 text-3xl font-semibold">Super Admin Login</h1>
        <p className="mt-2 text-sm text-slate-300">
          Access platform controls, tenant provisioning, and cross-school visibility.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-200">Username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none focus:border-emerald-300"
              placeholder="superadmin"
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-200">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none focus:border-emerald-300"
              placeholder="••••••••"
              required
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Enter Portal'}
          </button>
        </form>
      </div>
    </div>
  )
}
