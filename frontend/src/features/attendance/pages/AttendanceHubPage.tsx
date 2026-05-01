import { AxiosError } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { DataTable, type DataTableColumn } from '../../../components/ui/DataTable'
import { EmptyState } from '../../../components/ui/EmptyState'
import { FormInput } from '../../../components/ui/FormInput'
import { FormSelect } from '../../../components/ui/FormSelect'
import { PageHeader } from '../../../components/ui/PageHeader'
import { SearchableSelect } from '../../../components/ui/SearchableSelect'
import { Skeleton } from '../../../components/ui/Skeleton'
import { useSchoolDirectory } from '../../academic/hooks/useSchoolDirectory'
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

  const directory = useSchoolDirectory()
  const attendanceQuery = useAttendanceByDate(filterDate)
  const markMutation = useMarkAttendance()

  const records = attendanceQuery.data?.data ?? []
  const sectionOptions = directory.getSectionsForClass(form.classId)

  useEffect(() => {
    if (form.sectionId && !directory.isSectionValidForClass(form.classId, form.sectionId)) {
      setForm((current) => ({ ...current, sectionId: '' }))
    }
  }, [directory, form.classId, form.sectionId])

  const studentLabelById = useMemo(
    () => Object.fromEntries(directory.students.map((student) => [student.id, `${student.firstName} ${student.lastName} (${student.admissionNo})`])),
    [directory.students],
  )
  const classLabelById = useMemo(
    () => Object.fromEntries(directory.classes.map((item) => [item.id, item.name])),
    [directory.classes],
  )
  const sectionLabelById = useMemo(
    () => Object.fromEntries(directory.sections.map((item) => [item.id, `Section ${item.name}`])),
    [directory.sections],
  )

  const columns: DataTableColumn<AttendanceRecord>[] = [
    {
      key: 'studentId',
      header: 'Student',
      cell: (r) => <span className="font-medium text-slate-900">{studentLabelById[r.studentId] ?? 'Unknown student'}</span>,
    },
    {
      key: 'classId',
      header: 'Class',
      cell: (r) => classLabelById[r.classId] ?? 'Unknown class',
    },
    {
      key: 'sectionId',
      header: 'Section',
      cell: (r) => sectionLabelById[r.sectionId] ?? 'Unknown section',
    },
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

    if (!directory.isSectionValidForClass(form.classId, form.sectionId)) {
      showToast({
        title: 'Invalid section',
        description: 'Select a section that belongs to the chosen class.',
        tone: 'error',
      })
      return
    }

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
            <p className="mt-1 text-sm text-slate-500">Select the class, section, and student, then record the attendance status.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <SearchableSelect
              label="Student"
              selectedValue={form.studentId}
              onSelect={(value) => setForm((current) => ({ ...current, studentId: value }))}
              options={directory.studentOptions}
              placeholder="Search by name or admission number"
              emptyMessage="No student matched that search."
              helperText="Search using the student's name or admission number."
              required
            />
            <FormSelect
              label="Class"
              value={form.classId}
              onChange={(v) => setForm((f) => ({ ...f, classId: v }))}
              options={[{ value: '', label: 'Select a class' }, ...directory.classOptions]}
              required
            />
            <FormSelect
              label="Section"
              value={form.sectionId}
              onChange={(v) => setForm((f) => ({ ...f, sectionId: v }))}
              options={[
                { value: '', label: form.classId ? 'Select a section' : 'Select a class first' },
                ...sectionOptions,
              ]}
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
          {directory.hasError ? (
            <p className="text-sm text-rose-600">School directory data could not be loaded. Refresh and try again.</p>
          ) : null}
          <div>
            <Button type="submit" disabled={markMutation.isPending || directory.isLoading}>
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
