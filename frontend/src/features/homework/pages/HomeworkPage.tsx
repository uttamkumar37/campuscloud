import { AxiosError } from 'axios'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { FormInput } from '../../../components/ui/FormInput'
import { PageHeader } from '../../../components/ui/PageHeader'
import { Skeleton } from '../../../components/ui/Skeleton'
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
  const [lookupClassId, setLookupClassId] = useState('')
  const [searchClassId, setSearchClassId] = useState('')

  const createMutation = useCreateHomework()
  const homeworkQuery = useHomeworkByClass(searchClassId)

  const items = homeworkQuery.data?.data ?? []

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
            <FormInput
              label="Class ID (UUID)"
              value={form.classId}
              onChange={(v) => setForm((f) => ({ ...f, classId: v }))}
              placeholder="550e8400-…"
              required
            />
            <FormInput
              label="Section ID (UUID, optional)"
              value={form.sectionId ?? ''}
              onChange={(v) => setForm((f) => ({ ...f, sectionId: v }))}
              placeholder="Leave blank for all sections"
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
            <Button type="submit" disabled={createMutation.isPending}>
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
            <p className="mt-1 text-sm text-slate-500">Enter a class ID to browse assignments.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={lookupClassId}
              onChange={(e) => setLookupClassId(e.target.value)}
              placeholder="Class UUID…"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-64"
            />
            <Button variant="secondary" onClick={() => setSearchClassId(lookupClassId)}>
              Load
            </Button>
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
            title={searchClassId ? 'No homework found' : 'Enter a class ID to load homework'}
            description={searchClassId ? 'No assignments have been created for this class yet.' : ''}
          />
        ) : (
          <div className="grid gap-3">
            {items.map((h) => (
              <div key={h.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-semibold text-slate-900">{h.title}</p>
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
