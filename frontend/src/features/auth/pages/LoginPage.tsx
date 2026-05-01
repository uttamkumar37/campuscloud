import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { useLogin } from '../hooks/useLogin'
import { getSchoolBySlug, searchSchools } from '../api/authApi'
import type { SchoolSearchResult, UserRole } from '../types'

const SCHOOL_ROLES: Array<{
  value: Exclude<UserRole, 'SUPER_ADMIN'>
  label: string
  description: string
}> = [
  {
    value: 'SCHOOL_ADMIN',
    label: 'School leadership',
    description: 'Manage academics, staff, admissions, and daily operations.',
  },
  {
    value: 'TEACHER',
    label: 'Teacher',
    description: 'Take attendance, publish homework, manage marks, and track classes.',
  },
  {
    value: 'STUDENT',
    label: 'Student',
    description: 'View timetable, homework, attendance, and fee status.',
  },
  {
    value: 'PARENT',
    label: 'Parent',
    description: 'Follow your children, attendance, fee dues, and academic updates.',
  },
]

function schoolInitials(schoolName: string) {
  return schoolName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
}

function getSchoolSlugFromHostname(hostname: string) {
  const normalizedHost = hostname.trim().toLowerCase()

  if (!normalizedHost || normalizedHost === 'localhost' || normalizedHost === '127.0.0.1') {
    return null
  }

  if (normalizedHost.endsWith('.localhost')) {
    const candidate = normalizedHost.slice(0, -'.localhost'.length)
    return candidate && !candidate.includes('.') ? candidate : null
  }

  const segments = normalizedHost.split('.')
  if (segments.length >= 3) {
    const candidate = segments[0]
    return ['www', 'app', 'api', 'admin', 'super-admin'].includes(candidate) ? null : candidate
  }

  return null
}

export function LoginPage() {
  const navigate = useNavigate()
  const { setAuthSession } = useAuth()
  const loginMutation = useLogin()

  const [schoolQuery, setSchoolQuery] = useState('')
  const [selectedSchool, setSelectedSchool] = useState<SchoolSearchResult | null>(null)
  const [selectedRole, setSelectedRole] = useState<Exclude<UserRole, 'SUPER_ADMIN'> | null>(null)
  const [lockedSchoolSlug, setLockedSchoolSlug] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
  })
  const [formError, setFormError] = useState<string | null>(null)

  const deferredSchoolQuery = useDeferredValue(schoolQuery.trim())
  const schoolsQuery = useQuery({
    queryKey: ['auth', 'schools', deferredSchoolQuery],
    queryFn: () => searchSchools(deferredSchoolQuery),
    enabled: !selectedSchool && deferredSchoolQuery.length >= 2,
    staleTime: 60_000,
  })

  const selectedRoleMeta = useMemo(
    () => SCHOOL_ROLES.find((role) => role.value === selectedRole) ?? null,
    [selectedRole],
  )

  useEffect(() => {
    const slug = getSchoolSlugFromHostname(window.location.hostname)
    if (!slug) {
      return
    }

    let cancelled = false

    getSchoolBySlug(slug)
      .then((response) => {
        if (!cancelled && response.success) {
          setSelectedSchool(response.data)
          setLockedSchoolSlug(slug)
          setSchoolQuery(response.data.schoolName)
          setFormError(null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLockedSchoolSlug(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    if (!selectedSchool || !selectedRole) {
      setFormError('Choose your school and workspace before signing in.')
      return
    }

    try {
      const response = await loginMutation.mutateAsync({
        ...formValues,
        tenantSlug: selectedSchool.slug,
        role: selectedRole,
      })

      if (!response.success) {
        setFormError(response.message || 'Invalid credentials')
        return
      }

      setAuthSession(response.data)

      const role = response.data.role
      let redirectPath = '/dashboard'
      if (role === 'SUPER_ADMIN') redirectPath = '/super-admin/dashboard'
      else if (role === 'TEACHER') redirectPath = '/teacher/dashboard'
      else if (role === 'STUDENT') redirectPath = '/student/dashboard'
      else if (role === 'PARENT') redirectPath = '/parent/dashboard'

      navigate(redirectPath, { replace: true })
    } catch {
      setFormError('Unable to sign in. Check your credentials, school, and selected workspace.')
    }
  }

  const schoolResults = schoolsQuery.data?.data ?? []

  return (
    <div className="min-h-screen bg-[#f3f7f2] px-4 py-8 text-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-[0_30px_90px_-42px_rgba(15,23,42,0.45)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden bg-[#123d36] px-8 py-10 text-white md:px-10 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.35),transparent_32%)]" />
          <div className="relative space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200">CloudCampus</p>
              <h1 className="mt-5 max-w-md text-4xl font-semibold tracking-tight">Choose your school, then enter the right workspace.</h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/78">
                School search replaces technical tenant IDs. Pick the campus first, confirm your role, and continue with your usual credentials.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                ['1', 'Find school', selectedSchool ? selectedSchool.schoolName : 'Search by school name'],
                ['2', 'Choose workspace', selectedRoleMeta ? selectedRoleMeta.label : 'Select how you are signing in'],
                ['3', 'Enter credentials', selectedSchool && selectedRole ? 'Access your dashboard' : 'Available after setup'],
              ].map(([step, title, detail]) => (
                <div key={step} className="rounded-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/55">Step {step}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm text-white/72">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center bg-[#fbfcf8] p-6 md:p-8 lg:p-10">
          <div className="w-full rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.28)] md:p-8">
            {!selectedSchool ? (
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">School selection</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Find your campus</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {lockedSchoolSlug
                      ? 'This address already points to a school workspace. Loading the matching campus...'
                      : 'Start typing your school name. We will match active CloudCampus schools as you type.'}
                  </p>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">School name</span>
                  <input
                    type="text"
                    value={schoolQuery}
                    onChange={(event) => setSchoolQuery(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-200 transition focus:ring-2"
                    placeholder="Search by school name"
                    autoFocus
                    disabled={Boolean(lockedSchoolSlug)}
                  />
                </label>

                {deferredSchoolQuery.length < 2 ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Enter at least two characters to search.
                  </div>
                ) : null}

                {schoolsQuery.isLoading ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Looking up matching schools...
                  </div>
                ) : null}

                {schoolsQuery.isError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    We could not search schools right now.
                  </div>
                ) : null}

                {schoolResults.length ? (
                  <div className="space-y-3">
                    {schoolResults.map((school) => (
                      <button
                        key={school.slug}
                        type="button"
                        onClick={() => {
                          setSelectedSchool(school)
                          setFormError(null)
                        }}
                        className="flex w-full items-center gap-4 rounded-[24px] border border-slate-200 px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/60"
                      >
                        {school.logoUrl ? (
                          <img src={school.logoUrl} alt={school.schoolName} className="h-12 w-12 rounded-2xl border border-slate-200 object-cover" />
                        ) : (
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white"
                            style={{ backgroundColor: school.primaryColor }}
                          >
                            {schoolInitials(school.schoolName)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-950">{school.schoolName}</p>
                          <p className="text-sm text-slate-500">Continue with this school workspace</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}

                {deferredSchoolQuery.length >= 2 && !schoolsQuery.isLoading && !schoolResults.length ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    No matching schools found for “{deferredSchoolQuery}”.
                  </div>
                ) : null}
              </div>
            ) : !selectedRole ? (
              <div className="space-y-5">
                <div className="flex items-center gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                  {selectedSchool.logoUrl ? (
                    <img src={selectedSchool.logoUrl} alt={selectedSchool.schoolName} className="h-14 w-14 rounded-2xl border border-slate-200 object-cover" />
                  ) : (
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-base font-bold text-white"
                      style={{ backgroundColor: selectedSchool.primaryColor }}
                    >
                      {schoolInitials(selectedSchool.schoolName)}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Selected school</p>
                    <p className="mt-1 text-xl font-semibold text-slate-950">{selectedSchool.schoolName}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">Workspace selection</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">How are you signing in today?</h2>
                  <p className="mt-2 text-sm text-slate-600">Choose the role that matches the dashboard you expect to enter.</p>
                </div>

                <div className="space-y-3">
                  {SCHOOL_ROLES.map((roleOption) => (
                    <button
                      key={roleOption.value}
                      type="button"
                      onClick={() => {
                        setSelectedRole(roleOption.value)
                        setFormError(null)
                      }}
                      className="w-full rounded-[24px] border border-slate-200 px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/60"
                    >
                      <p className="font-semibold text-slate-950">{roleOption.label}</p>
                      <p className="mt-1 text-sm text-slate-600">{roleOption.description}</p>
                    </button>
                  ))}
                </div>

                {!lockedSchoolSlug ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSchool(null)
                      setSchoolQuery(selectedSchool.schoolName)
                    }}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Choose a different school
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Ready to sign in</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Welcome to {selectedSchool.schoolName}</h2>
                  <p className="mt-2 text-sm text-slate-600">Entering as {selectedRoleMeta?.label.toLowerCase()}.</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">Username</span>
                    <input
                      type="text"
                      value={formValues.username}
                      onChange={(event) =>
                        setFormValues((previous) => ({ ...previous, username: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-200 transition focus:ring-2"
                      placeholder="Enter your username"
                      required
                      autoFocus
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
                    <input
                      type="password"
                      value={formValues.password}
                      onChange={(event) =>
                        setFormValues((previous) => ({ ...previous, password: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-200 transition focus:ring-2"
                      placeholder="••••••••"
                      required
                    />
                  </label>

                  {formError ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {formError}
                    </div>
                  ) : null}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole(null)}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Change workspace
                    </button>
                    <button
                      type="submit"
                      disabled={loginMutation.isPending}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                    >
                      {loginMutation.isPending ? 'Signing in...' : 'Enter dashboard'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
