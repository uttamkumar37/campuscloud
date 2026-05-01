import { AxiosError } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { FormInput } from '../../../components/ui/FormInput'
import { FormSelect } from '../../../components/ui/FormSelect'
import { PageHeader } from '../../../components/ui/PageHeader'
import { Skeleton } from '../../../components/ui/Skeleton'
import { useSchoolDirectory } from '../../academic/hooks/useSchoolDirectory'
import type { ApiResponse } from '../../../types/api'
import { showToast } from '../../../utils/toast'

import { useCreateHomework, useHomeworkByClass } from '../hooks/useHomework'
import type { CreateHomeworkRequest } from '../types'

const today = new Date().toISOString().slice(0, 10)

const emptyForm: CreateHomeworkRequest = {
  title: '',
  description: null,
  classId: '',
  sectionId: null,
  dueDate: null,
}

export function HomeworkPage() {
  const [form, setForm] = useState<CreateHomeworkRequest>(emptyForm)
  const [searchClassId, setSearchClassId] = useState('')

  const directory = useSchoolDirectory()
  const createMutation = useCreateHomework()
  const homeworkQuery = useHomeworkByClass(searchClassId)

  const items = homeworkQuery.data?.data ?? []
  const sectionOptions = directory.getSectionsForClass(form.classId)
  const classLabelById = useMemo(
    () => Object.fromEntries(directory.classes.map((item) => [item.id, item.name])),
    [directory.classes],
  )
  const sectionLabelById = useMemo(
    () => Object.fromEntries(directory.sections.map((item) => [item.id, `Section ${item.name}`])),
    [directory.sections],
  )

  useEffect(() => {
    if (form.sectionId && !directory.isSectionValidForClass(form.classId, form.sectionId)) {
      setForm((current) => ({ ...current, sectionId: null }))
    }
  }, [directory, form.classId, form.sectionId])

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (form.sectionId && !directory.isSectionValidForClass(form.classId, form.sectionId)) {
      showToast({ title: 'Invalid section', description: 'Select a section that belongs to the chosen class.', tone: 'error' })
      return
    }

    try {
      const res = await createMutation.mutateAsync({
        ...form,
        description: form.description?.trim() || null,
        sectionId: form.sectionId?.trim() || null,
        dueDate: form.dueDate?.trim() || null,
      })
      if (!res.success) {
        showToast({ title: 'Not created', description: res.message, tone: 'error' })
        return
      }
      showToast({ title: 'Homework assigned', description: res.data.title, tone: 'success' })
      setForm(emptyForm)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>
      showToast({ title: 'Not created', description: axiosError.response?.data?.message ?? 'Error', tone: 'error' })
    }
  }

  const isOverdue = (dueDate: string | null) =>
    dueDate !== null && dueDate < today

  return (
    <section className="space-y-6">
      <PageHeader title="Homework" subtitle="Assign homework per class and view pending tasks." />

      {/* Create homework form */}
      <Card className="p-0">
        <form className="grid gap-5 p-6" onSubmit={handleCreate}>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Assign Homework</h2>
            <p className="mt-1 text-sm text-slate-500">Create a homework task for a class (and optionally a section).</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              label="Title"
              value={form.title}
              onChange={(v) => setForm((f) => ({ ...f, title: v }))}
              placeholder="Chapter 5 Exercises"
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
              value={form.sectionId ?? ''}
              onChange={(v) => setForm((f) => ({ ...f, sectionId: v }))}
              options={[
                { value: '', label: form.classId ? 'All sections' : 'Select a class first' },
                ...sectionOptions,
              ]}
            />
            <FormInput
              label="Due Date (optional)"
              type="date"
              value={form.dueDate ?? ''}
              onChange={(v) => setForm((f) => ({ ...f, dueDate: v }))}
            />
            <div className="md:col-span-2">
              <FormInput
                label="Description (optional)"
                value={form.description ?? ''}
                onChange={(v) => setForm((f) => ({ ...f, description: v }))}
                placeholder="Complete problems 1–20 on page 87"
              />
            </div>
          </div>
          <div>
            <Button type="submit" disabled={createMutation.isPending || directory.isLoading}>
              {createMutation.isPending ? 'Assigning…' : 'Assign Homework'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Homework list by class */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-950">Homework by Class</h2>
            <p className="mt-1 text-sm text-slate-500">Choose a class to browse assignments.</p>
          </div>
          <div className="w-full max-w-xs">
            <FormSelect
              label="Class"
              value={searchClassId}
              onChange={setSearchClassId}
              options={[{ value: '', label: 'Select a class to browse homework' }, ...directory.classOptions]}
            />
          </div>
        </div>

        {homeworkQuery.isLoading ? (
          <div className="grid gap-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : homeworkQuery.isError ? (
          <EmptyState title="Unable to load homework" description="Could not fetch homework for this class." />
        ) : items.length === 0 ? (
          <EmptyState
            title={searchClassId ? 'No homework found' : 'Select a class to load homework'}
            description={searchClassId ? 'No assignments have been created for this class yet.' : ''}
          />
        ) : (
          <div className="grid gap-3">
            {items.map((h) => (
              <div key={h.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{h.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {classLabelById[h.classId] ?? 'Unknown class'}
                      {h.sectionId ? ` · ${sectionLabelById[h.sectionId] ?? 'Unknown section'}` : ' · All sections'}
                    </p>
                  </div>
                  {h.dueDate ? (
                    <span
                      className={`shrink-0 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isOverdue(h.dueDate) ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}
                    >
                      Due {h.dueDate}
                    </span>
                  ) : null}
                </div>
                {h.description ? <p className="mt-2 text-sm text-slate-600">{h.description}</p> : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
