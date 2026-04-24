import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { FormInput } from '../../../components/ui/FormInput'

import type { CreateTeacherRequest } from '../types'

interface TeacherFormProps {
  onSubmit: (payload: CreateTeacherRequest) => Promise<boolean>
  isSubmitting: boolean
}

const initialValues: CreateTeacherRequest = {
  employeeNo: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  hireDate: '',
}

export function TeacherForm({ onSubmit, isSubmitting }: TeacherFormProps) {
  const [values, setValues] = useState<CreateTeacherRequest>(initialValues)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const created = await onSubmit({
      ...values,
      phone: values.phone?.trim() || null,
    })

    if (created) {
      setValues(initialValues)
    }
  }

  return (
    <Card className="p-0">
      <form className="grid gap-5 p-6" onSubmit={handleSubmit}>
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Create Teacher</h2>
          <p className="mt-1 text-sm text-slate-500">Add a faculty member with tenant-scoped identity and hiring data.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            label="Employee Number"
            value={values.employeeNo}
            onChange={(value) => setValues((current) => ({ ...current, employeeNo: value }))}
            placeholder="EMP-2001"
            required
          />
          <FormInput
            label="Hire Date"
            type="date"
            value={values.hireDate}
            onChange={(value) => setValues((current) => ({ ...current, hireDate: value }))}
            required
          />
          <FormInput
            label="First Name"
            value={values.firstName}
            onChange={(value) => setValues((current) => ({ ...current, firstName: value }))}
            required
          />
          <FormInput
            label="Last Name"
            value={values.lastName}
            onChange={(value) => setValues((current) => ({ ...current, lastName: value }))}
            required
          />
          <FormInput
            label="Email"
            type="email"
            value={values.email}
            onChange={(value) => setValues((current) => ({ ...current, email: value }))}
            placeholder="teacher@school.edu"
            required
          />
          <FormInput
            label="Phone"
            value={values.phone ?? ''}
            onChange={(value) => setValues((current) => ({ ...current, phone: value }))}
            placeholder="+91-9999999999"
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="md:w-fit">
          {isSubmitting ? 'Creating Teacher...' : 'Create Teacher'}
        </Button>
      </form>
    </Card>
  )
}
