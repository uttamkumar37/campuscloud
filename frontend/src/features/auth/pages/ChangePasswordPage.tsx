import { useState } from 'react'
import { PageHeader } from '../../../components/ui/PageHeader'
import { useChangePassword } from '../hooks/useChangePassword'
import { showToast } from '../../../utils/toast'

export function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const changePasswordMutation = useChangePassword()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      showToast({ title: 'Passwords do not match', tone: 'error' })
      return
    }
    if (newPassword.length < 8) {
      showToast({ title: 'New password must be at least 8 characters', tone: 'error' })
      return
    }
    changePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          showToast({ title: 'Password changed successfully', tone: 'success' })
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        },
        onError: () => {
          showToast({ title: 'Failed to change password. Check your current password.', tone: 'error' })
        },
      },
    )
  }

  return (
    <section className="space-y-6 max-w-md">
      <PageHeader title="Change Password" subtitle="Update your account password." />

      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl border border-slate-200 p-6">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {changePasswordMutation.isPending ? 'Saving…' : 'Change Password'}
        </button>
      </form>
    </section>
  )
}
