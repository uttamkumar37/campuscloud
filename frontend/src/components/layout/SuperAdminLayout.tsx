import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '../../features/auth/hooks/useAuth'

const navigation = [
  { to: '/super-admin/dashboard', label: 'Overview' },
  { to: '/super-admin/tenants', label: 'Tenants' },
]

export function SuperAdminLayout() {
  const navigate = useNavigate()
  const { logout, username } = useAuth()

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <div className="mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 xl:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-200 bg-slate-950 px-6 py-8 text-white xl:border-b-0 xl:border-r">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">CampusCloud</p>
          <h1 className="mt-3 text-2xl font-semibold">Super Admin Portal</h1>
          <p className="mt-2 text-sm text-slate-300">Platform-wide tenant governance and growth monitoring.</p>

          <div className="mt-8 rounded-[26px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Operator</p>
            <p className="mt-2 text-lg font-semibold">{username ?? 'superadmin'}</p>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-white text-slate-950' : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/super-admin/login', { replace: true })
            }}
            className="mt-8 w-full rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Logout
          </button>
        </aside>

        <main className="px-4 py-6 md:px-8 xl:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
