import { AxiosError } from 'axios'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { DataTable, type DataTableColumn } from '../../../components/ui/DataTable'
import { EmptyState } from '../../../components/ui/EmptyState'
import { FormInput } from '../../../components/ui/FormInput'
import { FormSelect } from '../../../components/ui/FormSelect'
import { PageHeader } from '../../../components/ui/PageHeader'
import { Skeleton } from '../../../components/ui/Skeleton'
import type { ApiResponse } from '../../../types/api'
import { showToast } from '../../../utils/toast'

import { useAttendanceByDate, useMarkAttendance } from '../hooks/useAttendance'
import type { AttendanceRecord, AttendanceStatus, MarkAttendanceRequest } from '../types'

const STATUS_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: 'PRESENT', label: 'Present' },
  { value: 'ABSENT', label: 'Absent' },
  { value: 'LATE', label: 'Late' },
  { value: 'EXCUSED', label: 'Excused' },
]

const STATUS_BADGE: Record<AttendanceStatus, string> = {
  PRESENT: 'bg-emerald-100 text-emerald-700',
  ABSENT: 'bg-rose-100 text-rose-700',
  LATE: 'bg-amber-100 text-amber-700',
  EXCUSED: 'bg-slate-100 text-slate-600',
}

const today = new Date().toISOString().slice(0, 10)

const emptyForm: MarkAttendanceRequest = {
  studentId: '',
  classId: '',
  sectionId: '',
  attendanceDate: today,
  status: 'PRESENT',
  remarks: null,
}

export function AttendanceHubPage() {
  const [filterDate, setFilterDate] = useState(today)
  const [form, setForm] = useState<MarkAttendanceRequest>(emptyForm)

  const attendanceQuery = useAttendanceByDate(filterDate)
  const markMutation = useMarkAttendance()

  const records = attendanceQuery.data?.data ?? []

  const columns: DataTableColumn<AttendanceRecord>[] = [
    { key: 'studentId', header: 'Student ID', cell: (r) => <span className="font-mono text-xs">{r.studentId}</span> },
    { key: 'date', header: 'Date', cell: (r) => r.attendanceDate },
    {
      key: 'status',
      header: 'Status',
      cell: (r) => (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[r.status]}`}>
          {r.status}
        </span>
      ),
    },
    { key: 'remarks', header: 'Remarks', cell: (r) => r.remarks ?? '—' },
  ]

  const handleMark = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const res = await markMutation.mutateAsync({
        ...form,
        remarks: form.remarks?.trim() || null,
      })
      if (!res.success) {
        showToast({ title: 'Not recorded', description: res.message, tone: 'error' })
        return
      }
      showToast({ title: 'Attendance recorded', description: `Status: ${res.data.status}`, tone: 'success' })
      setForm(emptyForm)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>
      showToast({
        title: 'Not recorded',
        description: axiosError.response?.data?.message ?? 'Unable to mark attendance',
        tone: 'error',
      })
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Attendance" subtitle="Record daily attendance and view reports by date." />

      {/* Mark attendance form */}
      <Card className="p-0">
        <form className="grid gap-5 p-6" onSubmit={handleMark}>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Mark Attendance</h2>
            <p className="mt-1 text-sm text-slate-500">Fill student, class, section, and status for a single record.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              label="Student ID (UUID)"
              value={form.studentId}
              onChange={(v) => setForm((f) => ({ ...f, studentId: v }))}
              placeholder="550e8400-…"
              required
            />
            <FormInput
              label="Class ID (UUID)"
              value={form.classId}
              onChange={(v) => setForm((f) => ({ ...f, classId: v }))}
              placeholder="a1b2c3d4-…"
              required
            />
            <FormInput
              label="Section ID (UUID)"
              value={form.sectionId}
              onChange={(v) => setForm((f) => ({ ...f, sectionId: v }))}
              placeholder="e5f6a7b8-…"
              required
            />
            <FormInput
              label="Date"
              type="date"
              value={form.attendanceDate}
              onChange={(v) => setForm((f) => ({ ...f, attendanceDate: v }))}
              required
            />
            <FormSelect
              label="Status"
              value={form.status}
              onChange={(v) => setForm((f) => ({ ...f, status: v as AttendanceStatus }))}
              options={STATUS_OPTIONS}
              required
            />
            <FormInput
              label="Remarks (optional)"
              value={form.remarks ?? ''}
              onChange={(v) => setForm((f) => ({ ...f, remarks: v }))}
              placeholder="On time, medical leave, etc."
            />
          </div>
          <div>
            <Button type="submit" disabled={markMutation.isPending}>
              {markMutation.isPending ? 'Saving…' : 'Mark Attendance'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Attendance list filtered by date */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Attendance Records</h2>
            <p className="mt-1 text-sm text-slate-500">Filter by date to view all attendance entries.</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>

        {attendanceQuery.isLoading ? (
          <div className="grid gap-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : attendanceQuery.isError ? (
          <EmptyState title="Unable to load records" description="Attendance records could not be fetched for this date." />
        ) : (
          <DataTable
            columns={columns}
            rows={records}
            rowKey={(r) => r.id}
            emptyText="No attendance records for this date."
          />
        )}
      </div>
    </section>
  )
}
