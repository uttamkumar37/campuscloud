import { AxiosError } from 'axios'
import { useState } from 'react'

import { DataTable, type DataTableColumn } from '../../../components/ui/DataTable'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PageHeader } from '../../../components/ui/PageHeader'
import { Skeleton } from '../../../components/ui/Skeleton'
import type { ApiResponse } from '../../../types/api'
import { showToast } from '../../../utils/toast'

import { TeacherForm } from '../components/TeacherForm'
import { useCreateTeacher } from '../hooks/useCreateTeacher'
import { useTeachers } from '../hooks/useTeachers'
import type { CreateTeacherRequest, Teacher } from '../types'

export function TeachersPage() {
  const [page, setPage] = useState(0)
  const size = 20
  const teachersQuery = useTeachers({ page, size })
  const createTeacherMutation = useCreateTeacher()

  const teachers = teachersQuery.data?.data.content ?? []
  const pageInfo = teachersQuery.data?.data

  const columns: DataTableColumn<Teacher>[] = [
    {
      key: 'employeeNo',
      header: 'Employee No',
      cell: (teacher) => <span className="font-medium text-slate-900">{teacher.employeeNo}</span>,
    },
    {
      key: 'name',
      header: 'Name',
      cell: (teacher) => `${teacher.firstName} ${teacher.lastName}`,
    },
    {
      key: 'email',
      header: 'Email',
      cell: (teacher) => teacher.email,
    },
    {
      key: 'phone',
      header: 'Phone',
      cell: (teacher) => teacher.phone || '-',
    },
    {
      key: 'hireDate',
      header: 'Hire Date',
      cell: (teacher) => teacher.hireDate,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (teacher) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            teacher.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
          }`}
        >
          {teacher.active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ]

  const handleCreateTeacher = async (payload: CreateTeacherRequest) => {
    try {
      const response = await createTeacherMutation.mutateAsync(payload)

      if (!response.success) {
        showToast({ title: 'Teacher not created', description: response.message, tone: 'error' })
        return false
      }

      showToast({
        title: 'Teacher created',
        description: `${response.data.firstName} ${response.data.lastName} is now available in the directory.`,
        tone: 'success',
      })
      return true
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>
      showToast({
        title: 'Teacher not created',
        description: axiosError.response?.data?.message ?? 'Unable to create teacher',
        tone: 'error',
      })
      return false
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Teachers"
        subtitle="Manage faculty records with paginated directory views and secure onboarding flows."
      />

      <TeacherForm onSubmit={handleCreateTeacher} isSubmitting={createTeacherMutation.isPending} />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Teacher Directory</h2>
            <p className="mt-1 text-sm text-slate-500">
              {pageInfo ? `${pageInfo.totalElements} teachers available in this tenant` : 'Loading directory'}
            </p>
          </div>
        </div>

        {teachersQuery.isLoading ? (
          <div className="grid gap-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : null}

        {teachersQuery.isError ? (
          <EmptyState
            title="Unable to load teachers"
            description="The teacher directory could not be fetched. Try again in a moment."
          />
        ) : null}

        {!teachersQuery.isLoading && !teachersQuery.isError ? (
          <DataTable
            columns={columns}
            rows={teachers}
            rowKey={(teacher) => teacher.id}
            emptyText="No teachers found for this tenant."
          />
        ) : null}

        {pageInfo ? (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              disabled={pageInfo.page === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-600">
              Page {pageInfo.page + 1} of {Math.max(pageInfo.totalPages, 1)}
            </span>
            <Button
              variant="secondary"
              onClick={() => setPage((current) => current + 1)}
              disabled={pageInfo.last}
            >
              Next
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
