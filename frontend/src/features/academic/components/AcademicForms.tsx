import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { FormInput } from '../../../components/ui/FormInput'
import { FormSelect } from '../../../components/ui/FormSelect'

import type {
  AcademicClass,
  CreateAcademicClassRequest,
  CreateAcademicSectionRequest,
  CreateAcademicSubjectRequest,
} from '../types'

interface AcademicClassFormProps {
  onSubmit: (payload: CreateAcademicClassRequest) => Promise<boolean>
  isSubmitting: boolean
}

export function AcademicClassForm({ onSubmit, isSubmitting }: AcademicClassFormProps) {
  const [values, setValues] = useState<CreateAcademicClassRequest>({ name: '', code: '' })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (await onSubmit(values)) {
      setValues({ name: '', code: '' })
    }
  }

  return (
    <Card>
      <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit}>
        <FormInput
          label="Class Name"
          value={values.name}
          onChange={(value) => setValues((current) => ({ ...current, name: value }))}
          placeholder="Grade 10"
          required
        />
        <FormInput
          label="Class Code"
          value={values.code}
          onChange={(value) => setValues((current) => ({ ...current, code: value }))}
          placeholder="G10"
          required
        />
        <div className="flex items-end">
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting ? 'Creating...' : 'Add Class'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

interface AcademicSubjectFormProps {
  onSubmit: (payload: CreateAcademicSubjectRequest) => Promise<boolean>
  isSubmitting: boolean
}

export function AcademicSubjectForm({ onSubmit, isSubmitting }: AcademicSubjectFormProps) {
  const [values, setValues] = useState<CreateAcademicSubjectRequest>({ name: '', code: '' })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (await onSubmit(values)) {
      setValues({ name: '', code: '' })
    }
  }

  return (
    <Card>
      <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit}>
        <FormInput
          label="Subject Name"
          value={values.name}
          onChange={(value) => setValues((current) => ({ ...current, name: value }))}
          placeholder="Mathematics"
          required
        />
        <FormInput
          label="Subject Code"
          value={values.code}
          onChange={(value) => setValues((current) => ({ ...current, code: value }))}
          placeholder="MATH"
          required
        />
        <div className="flex items-end">
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting ? 'Creating...' : 'Add Subject'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

interface AcademicSectionFormProps {
  classes: AcademicClass[]
  onSubmit: (payload: CreateAcademicSectionRequest) => Promise<boolean>
  isSubmitting: boolean
}

export function AcademicSectionForm({
  classes,
  onSubmit,
  isSubmitting,
}: AcademicSectionFormProps) {
  const [values, setValues] = useState<CreateAcademicSectionRequest>({
    name: '',
    classId: classes[0]?.id ?? '',
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (await onSubmit(values)) {
      setValues({ name: '', classId: classes[0]?.id ?? '' })
    }
  }

  return (
    <Card>
      <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit}>
        <FormInput
          label="Section Name"
          value={values.name}
          onChange={(value) => setValues((current) => ({ ...current, name: value }))}
          placeholder="A"
          required
        />
        <FormSelect
          label="Class"
          value={values.classId}
          onChange={(value) => setValues((current) => ({ ...current, classId: value }))}
          options={[
            { value: '', label: 'Select class' },
            ...classes.map((item) => ({ value: item.id, label: `${item.name} (${item.code})` })),
          ]}
          required
        />
        <div className="flex items-end">
          <Button type="submit" disabled={isSubmitting || classes.length === 0} className="w-full md:w-auto">
            {isSubmitting ? 'Creating...' : 'Add Section'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
