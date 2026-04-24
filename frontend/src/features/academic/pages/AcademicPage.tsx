import { AxiosError } from 'axios'
import { useMemo, useState } from 'react'

import { DataTable, type DataTableColumn } from '../../../components/ui/DataTable'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PageHeader } from '../../../components/ui/PageHeader'
import { Skeleton } from '../../../components/ui/Skeleton'
import type { ApiResponse } from '../../../types/api'
import { showToast } from '../../../utils/toast'

import {
  AcademicClassForm,
  AcademicSectionForm,
  AcademicSubjectForm,
} from '../components/AcademicForms'
import {
  useAcademicClasses,
  useAcademicSections,
  useAcademicSubjects,
  useCreateAcademicClass,
  useCreateAcademicSection,
  useCreateAcademicSubject,
} from '../hooks/useAcademicData'
import type {
  AcademicClass,
  AcademicSection,
  AcademicSubject,
  CreateAcademicClassRequest,
  CreateAcademicSectionRequest,
  CreateAcademicSubjectRequest,
} from '../types'

type AcademicTab = 'classes' | 'subjects' | 'sections'

export function AcademicPage() {
  const [activeTab, setActiveTab] = useState<AcademicTab>('classes')
  const classesQuery = useAcademicClasses()
  const subjectsQuery = useAcademicSubjects()
  const sectionsQuery = useAcademicSections()
  const createClassMutation = useCreateAcademicClass()
  const createSubjectMutation = useCreateAcademicSubject()
  const createSectionMutation = useCreateAcademicSection()

  const classColumns: DataTableColumn<AcademicClass>[] = [
    { key: 'name', header: 'Class', cell: (row) => row.name },
    { key: 'code', header: 'Code', cell: (row) => row.code },
    { key: 'status', header: 'Status', cell: (row) => (row.active ? 'Active' : 'Inactive') },
  ]

  const subjectColumns: DataTableColumn<AcademicSubject>[] = [
    { key: 'name', header: 'Subject', cell: (row) => row.name },
    { key: 'code', header: 'Code', cell: (row) => row.code },
    { key: 'status', header: 'Status', cell: (row) => (row.active ? 'Active' : 'Inactive') },
  ]

  const sectionColumns: DataTableColumn<AcademicSection>[] = [
    { key: 'name', header: 'Section', cell: (row) => row.name },
    { key: 'className', header: 'Class', cell: (row) => row.className },
    { key: 'status', header: 'Status', cell: (row) => (row.active ? 'Active' : 'Inactive') },
  ]

  const tabs = useMemo(
    () => [
      { id: 'classes' as const, label: 'Classes' },
      { id: 'subjects' as const, label: 'Subjects' },
      { id: 'sections' as const, label: 'Sections' },
    ],
    [],
  )

  const handleClassCreate = async (payload: CreateAcademicClassRequest) => {
    try {
      const response = await createClassMutation.mutateAsync(payload)
      if (!response.success) {
        showToast({ title: 'Class not created', description: response.message, tone: 'error' })
        return false
      }
      showToast({ title: 'Class created', description: `${response.data.name} is ready to use.`, tone: 'success' })
      return true
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>
      showToast({ title: 'Class not created', description: axiosError.response?.data?.message, tone: 'error' })
      return false
    }
  }

  const handleSubjectCreate = async (payload: CreateAcademicSubjectRequest) => {
    try {
      const response = await createSubjectMutation.mutateAsync(payload)
      if (!response.success) {
        showToast({ title: 'Subject not created', description: response.message, tone: 'error' })
        return false
      }
      showToast({ title: 'Subject created', description: `${response.data.name} has been added.`, tone: 'success' })
      return true
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>
      showToast({ title: 'Subject not created', description: axiosError.response?.data?.message, tone: 'error' })
      return false
    }
  }

  const handleSectionCreate = async (payload: CreateAcademicSectionRequest) => {
    try {
      const response = await createSectionMutation.mutateAsync(payload)
      if (!response.success) {
        showToast({ title: 'Section not created', description: response.message, tone: 'error' })
        return false
      }
      showToast({ title: 'Section created', description: `${response.data.name} is now attached to ${response.data.className}.`, tone: 'success' })
      return true
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>
      showToast({ title: 'Section not created', description: axiosError.response?.data?.message, tone: 'error' })
      return false
    }
  }

  const renderTable = () => {
    if (activeTab === 'classes') {
      if (classesQuery.isLoading) {
        return <Skeleton className="h-32" />
      }
      if (classesQuery.isError) {
        return <EmptyState title="Classes unavailable" description="Class records could not be loaded." />
      }
      return (
        <DataTable
          columns={classColumns}
          rows={classesQuery.data?.data ?? []}
          rowKey={(row) => row.id}
          emptyText="No classes created yet."
        />
      )
    }

    if (activeTab === 'subjects') {
      if (subjectsQuery.isLoading) {
        return <Skeleton className="h-32" />
      }
      if (subjectsQuery.isError) {
        return <EmptyState title="Subjects unavailable" description="Subject records could not be loaded." />
      }
      return (
        <DataTable
          columns={subjectColumns}
          rows={subjectsQuery.data?.data ?? []}
          rowKey={(row) => row.id}
          emptyText="No subjects created yet."
        />
      )
    }

    if (sectionsQuery.isLoading) {
      return <Skeleton className="h-32" />
    }
    if (sectionsQuery.isError) {
      return <EmptyState title="Sections unavailable" description="Section records could not be loaded." />
    }
    return (
      <DataTable
        columns={sectionColumns}
        rows={sectionsQuery.data?.data ?? []}
        rowKey={(row) => row.id}
        emptyText="No sections created yet."
      />
    )
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Academic"
        subtitle="Manage classes, subjects, and sections through a segmented academic control center."
      />

      <div className="flex flex-wrap gap-2 rounded-[24px] border border-slate-200 bg-white p-2 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.25)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === tab.id
                ? 'bg-slate-950 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'classes' ? (
        <AcademicClassForm onSubmit={handleClassCreate} isSubmitting={createClassMutation.isPending} />
      ) : null}
      {activeTab === 'subjects' ? (
        <AcademicSubjectForm onSubmit={handleSubjectCreate} isSubmitting={createSubjectMutation.isPending} />
      ) : null}
      {activeTab === 'sections' ? (
        <AcademicSectionForm
          classes={classesQuery.data?.data ?? []}
          onSubmit={handleSectionCreate}
          isSubmitting={createSectionMutation.isPending}
        />
      ) : null}

      {renderTable()}
    </section>
  )
}
