import { AxiosError } from 'axios'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { FormInput } from '../../../components/ui/FormInput'
import { FormSelect } from '../../../components/ui/FormSelect'
import { PageHeader } from '../../../components/ui/PageHeader'
import { Skeleton } from '../../../components/ui/Skeleton'
import type { ApiResponse } from '../../../types/api'
import { showToast } from '../../../utils/toast'

import { useCreateTimetableSlot, useTimetable } from '../hooks/useTimetable'
import type { CreateTimetableSlotRequest, TimetableSlot } from '../types'

const DAY_NAMES: Record<number, string> = {
  1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
  4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday',
}

const DAY_OPTIONS = Object.entries(DAY_NAMES).map(([value, label]) => ({ value, label }))

const emptyForm: CreateTimetableSlotRequest = {
  classId: '',
  sectionId: null,
  subjectId: null,
  dayOfWeek: 1,
  startTime: '08:00',
  endTime: '09:00',
  label: null,
}

// Group slots by day for the weekly grid view
function groupByDay(slots: TimetableSlot[]) {
  return slots.reduce<Record<number, TimetableSlot[]>>((acc, slot) => {
    const day = slot.dayOfWeek
    if (!acc[day]) acc[day] = []
    acc[day].push(slot)
    return acc
  }, {})
}

export function TimetablePage() {
  const [form, setForm] = useState<CreateTimetableSlotRequest>(emptyForm)
  const [classLookup, setClassLookup] = useState('')
  const [sectionLookup, setSectionLookup] = useState('')
  const [searchClassId, setSearchClassId] = useState('')
  const [searchSectionId, setSearchSectionId] = useState('')

  const createMutation = useCreateTimetableSlot()
  const timetableQuery = useTimetable(searchClassId, searchSectionId)

  const slots = timetableQuery.data?.data ?? []
  const grouped = groupByDay(slots)

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const res = await createMutation.mutateAsync({
        ...form,
        sectionId: form.sectionId?.trim() || null,
        subjectId: form.subjectId?.trim() || null,
        label: form.label?.trim() || null,
      })
      if (!res.success) {
        showToast({ title: 'Slot not created', description: res.message, tone: 'error' })
        return
      }
      showToast({ title: 'Slot created', description: `${DAY_NAMES[res.data.dayOfWeek]} ${res.data.startTime}–${res.data.endTime}`, tone: 'success' })
      setForm(emptyForm)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>
      showToast({ title: 'Slot not created', description: axiosError.response?.data?.message ?? 'Error', tone: 'error' })
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Timetable" subtitle="Manage weekly class schedules. Day 1 = Monday … 7 = Sunday." />

      {/* Create slot form */}
      <Card className="p-0">
        <form className="grid gap-5 p-6" onSubmit={handleCreate}>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Add Timetable Slot</h2>
            <p className="mt-1 text-sm text-slate-500">Define a period in the weekly schedule for a class.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
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
              placeholder="Leave blank if not section-specific"
            />
            <FormInput
              label="Subject ID (UUID, optional)"
              value={form.subjectId ?? ''}
              onChange={(v) => setForm((f) => ({ ...f, subjectId: v }))}
              placeholder="e5f6a7b8-…"
            />
            <FormSelect
              label="Day of Week"
              value={String(form.dayOfWeek)}
              onChange={(v) => setForm((f) => ({ ...f, dayOfWeek: Number(v) }))}
              options={DAY_OPTIONS}
              required
            />
            <FormInput
              label="Start Time (HH:mm)"
              type="time"
              value={form.startTime}
              onChange={(v) => setForm((f) => ({ ...f, startTime: v }))}
              required
            />
            <FormInput
              label="End Time (HH:mm)"
              type="time"
              value={form.endTime}
              onChange={(v) => setForm((f) => ({ ...f, endTime: v }))}
              required
            />
            <div className="md:col-span-2">
              <FormInput
                label="Label (optional)"
                value={form.label ?? ''}
                onChange={(v) => setForm((f) => ({ ...f, label: v }))}
                placeholder="Mathematics - Period 1"
              />
            </div>
          </div>
          <div>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving…' : 'Add Slot'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Weekly grid view */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-950">Weekly View</h2>
            <p className="mt-1 text-sm text-slate-500">Enter class and section IDs to load the schedule.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={classLookup}
              onChange={(e) => setClassLookup(e.target.value)}
              placeholder="Class UUID…"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-48"
            />
            <input
              type="text"
              value={sectionLookup}
              onChange={(e) => setSectionLookup(e.target.value)}
              placeholder="Section UUID…"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-48"
            />
            <Button variant="secondary" onClick={() => { setSearchClassId(classLookup); setSearchSectionId(sectionLookup) }}>
              Load
            </Button>
          </div>
        </div>

        {timetableQuery.isLoading ? (
          <div className="grid gap-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : timetableQuery.isError ? (
          <EmptyState title="Unable to load timetable" description="Could not fetch the schedule for this class and section." />
        ) : slots.length === 0 ? (
          <EmptyState
            title={searchClassId ? 'No slots found' : 'Enter class and section IDs to load the timetable'}
            description={searchClassId ? 'No timetable slots have been created yet.' : ''}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[1, 2, 3, 4, 5].map((day) => (
              <div key={day} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-3 text-sm font-semibold text-slate-900">{DAY_NAMES[day]}</p>
                {grouped[day] ? (
                  <div className="space-y-2">
                    {grouped[day]
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((slot) => (
                        <div key={slot.id} className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-xs font-medium text-slate-700">
                            {slot.startTime}–{slot.endTime}
                          </p>
                          {slot.label ? <p className="text-xs text-slate-500 mt-0.5">{slot.label}</p> : null}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No periods</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
