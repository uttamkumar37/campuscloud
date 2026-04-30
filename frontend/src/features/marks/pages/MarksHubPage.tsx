import { AxiosError } from 'axios'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { DataTable, type DataTableColumn } from '../../../components/ui/DataTable'
import { EmptyState } from '../../../components/ui/EmptyState'
import { FormInput } from '../../../components/ui/FormInput'
import { PageHeader } from '../../../components/ui/PageHeader'
import { Skeleton } from '../../../components/ui/Skeleton'
import type { ApiResponse } from '../../../types/api'
import { showToast } from '../../../utils/toast'

import { useCreateExam, useCreateExamResult, useExamResults, useExamsByClass } from '../hooks/useExams'
import type { CreateExamRequest, CreateExamResultRequest, Exam, ExamResult } from '../types'

const emptyExamForm: CreateExamRequest = {
  title: '',
  examDate: '',
  classId: '',
  sectionId: '',
  subjectId: '',
  maxMarks: 100,
}

const emptyResultForm: CreateExamResultRequest = {
  examId: '',
  studentId: '',
  marksObtained: 0,
  grade: null,
  remarks: null,
  published: false,
}

type ActiveTab = 'exams' | 'results'

export function MarksHubPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('exams')
  const [examForm, setExamForm] = useState<CreateExamRequest>(emptyExamForm)
  const [resultForm, setResultForm] = useState<CreateExamResultRequest>(emptyResultForm)
  const [classLookup, setClassLookup] = useState('')
  const [searchClassId, setSearchClassId] = useState('')
  const [examLookup, setExamLookup] = useState('')
  const [searchExamId, setSearchExamId] = useState('')

  const createExamMutation = useCreateExam()
  const createResultMutation = useCreateExamResult()
  const examsQuery = useExamsByClass(searchClassId)
  const resultsQuery = useExamResults(searchExamId)

  const exams = examsQuery.data?.data ?? []
  const results = resultsQuery.data?.data ?? []

  const examColumns: DataTableColumn<Exam>[] = [
    { key: 'title', header: 'Title', cell: (r) => <span className="font-medium text-slate-900">{r.title}</span> },
    { key: 'date', header: 'Date', cell: (r) => r.examDate },
    { key: 'maxMarks', header: 'Max Marks', cell: (r) => r.maxMarks },
    { key: 'id', header: 'ID', cell: (r) => <span className="font-mono text-xs text-slate-500">{r.id}</span> },
  ]

  const resultColumns: DataTableColumn<ExamResult>[] = [
    { key: 'studentId', header: 'Student ID', cell: (r) => <span className="font-mono text-xs">{r.studentId}</span> },
    { key: 'marks', header: 'Marks', cell: (r) => r.marksObtained },
    { key: 'grade', header: 'Grade', cell: (r) => r.grade ?? '—' },
    { key: 'remarks', header: 'Remarks', cell: (r) => r.remarks ?? '—' },
    {
      key: 'published',
      header: 'Published',
      cell: (r) => (
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${r.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {r.published ? 'Yes' : 'No'}
        </span>
      ),
    },
  ]

  const handleCreateExam = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const res = await createExamMutation.mutateAsync({ ...examForm, maxMarks: Number(examForm.maxMarks) })
      if (!res.success) {
        showToast({ title: 'Exam not scheduled', description: res.message, tone: 'error' })
        return
      }
      showToast({ title: 'Exam scheduled', description: res.data.title, tone: 'success' })
      setExamForm(emptyExamForm)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>
      showToast({ title: 'Exam not scheduled', description: axiosError.response?.data?.message ?? 'Error', tone: 'error' })
    }
  }

  const handleCreateResult = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const res = await createResultMutation.mutateAsync({
        ...resultForm,
        marksObtained: Number(resultForm.marksObtained),
        grade: resultForm.grade?.trim() || null,
        remarks: resultForm.remarks?.trim() || null,
      })
      if (!res.success) {
        showToast({ title: 'Result not saved', description: res.message, tone: 'error' })
        return
      }
      showToast({ title: 'Result saved', description: `Marks: ${res.data.marksObtained}`, tone: 'success' })
      setResultForm(emptyResultForm)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>
      showToast({ title: 'Result not saved', description: axiosError.response?.data?.message ?? 'Error', tone: 'error' })
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Marks & Exams" subtitle="Schedule exams and record student results." />

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 w-fit">
        {(['exams', 'results'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-5 py-2 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab === 'exams' ? 'Exams' : 'Results'}
          </button>
        ))}
      </div>

      {activeTab === 'exams' && (
        <>
          {/* Create exam form */}
          <Card className="p-0">
            <form className="grid gap-5 p-6" onSubmit={handleCreateExam}>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Schedule Exam</h2>
                <p className="mt-1 text-sm text-slate-500">Define exam details tied to a class, section, and subject.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  label="Exam Title"
                  value={examForm.title}
                  onChange={(v) => setExamForm((f) => ({ ...f, title: v }))}
                  placeholder="Mid-Term Mathematics"
                  required
                />
                <FormInput
                  label="Exam Date"
                  type="date"
                  value={examForm.examDate}
                  onChange={(v) => setExamForm((f) => ({ ...f, examDate: v }))}
                  required
                />
                <FormInput
                  label="Class ID (UUID)"
                  value={examForm.classId}
                  onChange={(v) => setExamForm((f) => ({ ...f, classId: v }))}
                  placeholder="550e8400-…"
                  required
                />
                <FormInput
                  label="Section ID (UUID)"
                  value={examForm.sectionId}
                  onChange={(v) => setExamForm((f) => ({ ...f, sectionId: v }))}
                  placeholder="a1b2c3d4-…"
                  required
                />
                <FormInput
                  label="Subject ID (UUID)"
                  value={examForm.subjectId}
                  onChange={(v) => setExamForm((f) => ({ ...f, subjectId: v }))}
                  placeholder="e5f6a7b8-…"
                  required
                />
                <FormInput
                  label="Max Marks"
                  type="number"
                  value={String(examForm.maxMarks)}
                  onChange={(v) => setExamForm((f) => ({ ...f, maxMarks: Number(v) }))}
                  required
                />
              </div>
              <div>
                <Button type="submit" disabled={createExamMutation.isPending}>
                  {createExamMutation.isPending ? 'Scheduling…' : 'Schedule Exam'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Exams by class lookup */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-950">Exams by Class</h2>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={classLookup}
                  onChange={(e) => setClassLookup(e.target.value)}
                  placeholder="Class UUID…"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-64"
                />
                <Button variant="secondary" onClick={() => setSearchClassId(classLookup)}>
                  Load
                </Button>
              </div>
            </div>
            {examsQuery.isLoading ? <Skeleton className="h-24" /> : examsQuery.isError ? (
              <EmptyState title="Unable to load exams" description="Could not fetch exams for this class." />
            ) : (
              <DataTable columns={examColumns} rows={exams} rowKey={(r) => r.id} emptyText={searchClassId ? 'No exams for this class.' : 'Enter a class ID to load exams.'} />
            )}
          </div>
        </>
      )}

      {activeTab === 'results' && (
        <>
          {/* Enter result form */}
          <Card className="p-0">
            <form className="grid gap-5 p-6" onSubmit={handleCreateResult}>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Enter Result</h2>
                <p className="mt-1 text-sm text-slate-500">Record a student's marks for a specific exam.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  label="Exam ID (UUID)"
                  value={resultForm.examId}
                  onChange={(v) => setResultForm((f) => ({ ...f, examId: v }))}
                  placeholder="550e8400-…"
                  required
                />
                <FormInput
                  label="Student ID (UUID)"
                  value={resultForm.studentId}
                  onChange={(v) => setResultForm((f) => ({ ...f, studentId: v }))}
                  placeholder="a1b2c3d4-…"
                  required
                />
                <FormInput
                  label="Marks Obtained"
                  type="number"
                  value={String(resultForm.marksObtained || '')}
                  onChange={(v) => setResultForm((f) => ({ ...f, marksObtained: Number(v) }))}
                  required
                />
                <FormInput
                  label="Grade"
                  value={resultForm.grade ?? ''}
                  onChange={(v) => setResultForm((f) => ({ ...f, grade: v }))}
                  placeholder="A / B+ / C"
                />
                <FormInput
                  label="Remarks"
                  value={resultForm.remarks ?? ''}
                  onChange={(v) => setResultForm((f) => ({ ...f, remarks: v }))}
                  placeholder="Optional remarks"
                />
              </div>
              <div>
                <Button type="submit" disabled={createResultMutation.isPending}>
                  {createResultMutation.isPending ? 'Saving…' : 'Save Result'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Results by exam lookup */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-950">Results by Exam</h2>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={examLookup}
                  onChange={(e) => setExamLookup(e.target.value)}
                  placeholder="Exam UUID…"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-64"
                />
                <Button variant="secondary" onClick={() => setSearchExamId(examLookup)}>
                  Load
                </Button>
              </div>
            </div>
            {resultsQuery.isLoading ? <Skeleton className="h-24" /> : resultsQuery.isError ? (
              <EmptyState title="Unable to load results" description="Could not fetch results for this exam." />
            ) : (
              <DataTable columns={resultColumns} rows={results} rowKey={(r) => r.id} emptyText={searchExamId ? 'No results for this exam.' : 'Enter an exam ID to load results.'} />
            )}
          </div>
        </>
      )}
    </section>
  )
}
