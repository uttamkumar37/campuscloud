import { useState } from 'react'
import { useSubscriptionPlans, useCreatePlan } from '../hooks/useSubscription'
import type { PlanFeature } from '../types'

const ALL_FEATURES: PlanFeature[] = [
  'STUDENT_MANAGEMENT',
  'TEACHER_MANAGEMENT',
  'ACADEMIC_MANAGEMENT',
  'ATTENDANCE_TRACKING',
  'FEE_MANAGEMENT',
  'EXAM_MANAGEMENT',
  'HOMEWORK_MANAGEMENT',
  'TIMETABLE_MANAGEMENT',
  'PARENT_PORTAL',
  'BULK_UPLOAD',
  'DASHBOARD_ACCESS',
  'ADVANCED_REPORTS',
  'CUSTOM_BRANDING',
]

export default function SubscriptionPlansPage() {
  const { data: plans, isLoading } = useSubscriptionPlans()
  const createPlan = useCreatePlan()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    price: 0,
    billingCycleDays: 30,
    maxStudents: 100,
    maxTeachers: 10,
    description: '',
    features: [] as PlanFeature[],
  })

  function toggleFeature(f: PlanFeature) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter((x) => x !== f)
        : [...prev.features, f],
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createPlan.mutate(form, {
      onSuccess: () => {
        setShowForm(false)
        setForm({ name: '', price: 0, billingCycleDays: 30, maxStudents: 100, maxTeachers: 10, description: '', features: [] })
      },
    })
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ New Plan'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded p-4 mb-6 bg-gray-50 space-y-4">
          <h2 className="text-lg font-semibold">Create Plan</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              placeholder="Plan name (e.g. PRO)"
              className="border rounded px-3 py-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              required
              type="number"
              min={0}
              placeholder="Price (INR)"
              className="border rounded px-3 py-2"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
            <input
              required
              type="number"
              min={1}
              placeholder="Billing cycle days"
              className="border rounded px-3 py-2"
              value={form.billingCycleDays}
              onChange={(e) => setForm({ ...form, billingCycleDays: Number(e.target.value) })}
            />
            <input
              required
              type="number"
              min={-1}
              placeholder="Max students (-1 = unlimited)"
              className="border rounded px-3 py-2"
              value={form.maxStudents}
              onChange={(e) => setForm({ ...form, maxStudents: Number(e.target.value) })}
            />
            <input
              required
              type="number"
              min={-1}
              placeholder="Max teachers (-1 = unlimited)"
              className="border rounded px-3 py-2"
              value={form.maxTeachers}
              onChange={(e) => setForm({ ...form, maxTeachers: Number(e.target.value) })}
            />
            <input
              placeholder="Description"
              className="border rounded px-3 py-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <p className="font-medium mb-2">Features</p>
            <div className="flex flex-wrap gap-2">
              {ALL_FEATURES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFeature(f)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    form.features.includes(f)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={createPlan.isPending}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {createPlan.isPending ? 'Creating...' : 'Create Plan'}
          </button>
          {createPlan.isError && (
            <p className="text-red-500 text-sm">Failed to create plan. Please try again.</p>
          )}
        </form>
      )}

      {isLoading ? (
        <p>Loading plans...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans?.map((plan) => (
            <div key={plan.id} className="border rounded p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${plan.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {plan.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-2xl font-semibold text-blue-700 mb-1">
                ₹{plan.price.toLocaleString()}
                <span className="text-sm text-gray-500 font-normal"> / {plan.billingCycleDays}d</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Students: {plan.maxStudents === -1 ? 'Unlimited' : plan.maxStudents} &bull; Teachers: {plan.maxTeachers === -1 ? 'Unlimited' : plan.maxTeachers}
              </p>
              {plan.description && <p className="text-sm text-gray-500 mb-3">{plan.description}</p>}
              <div className="flex flex-wrap gap-1">
                {plan.features.map((f) => (
                  <span key={f} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
