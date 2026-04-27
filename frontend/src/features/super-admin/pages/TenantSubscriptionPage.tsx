import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  useTenantSubscription,
  useSubscribeTenant,
  useCancelSubscription,
  useTenantPayments,
  useRecordPayment,
} from '../hooks/useSubscription'
import { useSubscriptionPlans } from '../hooks/useSubscription'
import type { RecordPaymentRequest } from '../types'

export default function TenantSubscriptionPage() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const id = tenantId ?? ''

  const { data: subscription, isLoading: subLoading } = useTenantSubscription(id)
  const { data: plans } = useSubscriptionPlans()
  const { data: payments, isLoading: payLoading } = useTenantPayments(id)

  const subscribeMutation = useSubscribeTenant(id)
  const cancelMutation = useCancelSubscription(id)
  const recordPaymentMutation = useRecordPayment()

  const [subscribeForm, setSubscribeForm] = useState({ planId: '', durationDays: 365 })
  const [paymentForm, setPaymentForm] = useState<RecordPaymentRequest>({
    tenantId: id,
    subscriptionId: undefined,
    amount: 0,
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMethod: 'MANUAL',
    referenceNo: '',
    notes: '',
  })

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    subscribeMutation.mutate({ planId: subscribeForm.planId, durationDays: subscribeForm.durationDays })
  }

  function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    recordPaymentMutation.mutate({ ...paymentForm, tenantId: id })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Subscription Management — {id}</h1>

      {/* Active Subscription */}
      <section className="border rounded p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Active Subscription</h2>
        {subLoading ? (
          <p>Loading...</p>
        ) : subscription ? (
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Plan:</span> {subscription.plan.name}</p>
            <p><span className="font-medium">Status:</span> {subscription.status}</p>
            <p><span className="font-medium">Payment:</span> {subscription.paymentStatus}</p>
            <p><span className="font-medium">Period:</span> {subscription.startDate} → {subscription.endDate}</p>
            <button
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50 text-sm"
            >
              {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No active subscription.</p>
        )}
      </section>

      {/* Subscribe Form */}
      <section className="border rounded p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Assign / Change Plan</h2>
        <form onSubmit={handleSubscribe} className="flex flex-wrap gap-3 items-end">
          <select
            required
            className="border rounded px-3 py-2 text-sm"
            value={subscribeForm.planId}
            onChange={(e) => setSubscribeForm({ ...subscribeForm, planId: e.target.value })}
          >
            <option value="">Select a plan</option>
            {plans?.map((p) => (
              <option key={p.id} value={p.id}>{p.name} — ₹{p.price}</option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            placeholder="Duration (days)"
            className="border rounded px-3 py-2 text-sm w-40"
            value={subscribeForm.durationDays}
            onChange={(e) => setSubscribeForm({ ...subscribeForm, durationDays: Number(e.target.value) })}
          />
          <button
            type="submit"
            disabled={subscribeMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {subscribeMutation.isPending ? 'Saving...' : 'Subscribe'}
          </button>
        </form>
      </section>

      {/* Record Payment */}
      <section className="border rounded p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Record Payment</h2>
        <form onSubmit={handlePayment} className="grid grid-cols-2 gap-3">
          <input
            required
            type="number"
            min={0.01}
            step="0.01"
            placeholder="Amount"
            className="border rounded px-3 py-2 text-sm"
            value={paymentForm.amount || ''}
            onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
          />
          <input
            required
            type="date"
            className="border rounded px-3 py-2 text-sm"
            value={paymentForm.paymentDate}
            onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
          />
          <select
            className="border rounded px-3 py-2 text-sm"
            value={paymentForm.paymentMethod}
            onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as RecordPaymentRequest['paymentMethod'] })}
          >
            {['MANUAL', 'BANK_TRANSFER', 'UPI', 'RAZORPAY', 'STRIPE'].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            placeholder="Reference No."
            className="border rounded px-3 py-2 text-sm"
            value={paymentForm.referenceNo ?? ''}
            onChange={(e) => setPaymentForm({ ...paymentForm, referenceNo: e.target.value })}
          />
          <input
            placeholder="Notes"
            className="border rounded px-3 py-2 text-sm col-span-2"
            value={paymentForm.notes ?? ''}
            onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
          />
          <button
            type="submit"
            disabled={recordPaymentMutation.isPending}
            className="col-span-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
          >
            {recordPaymentMutation.isPending ? 'Recording...' : 'Record Payment'}
          </button>
        </form>
      </section>

      {/* Payment History */}
      <section className="border rounded p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Payment History</h2>
        {payLoading ? (
          <p>Loading...</p>
        ) : !payments?.length ? (
          <p className="text-gray-500 text-sm">No payment records.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Amount</th>
                <th className="border px-3 py-2">Method</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Ref No.</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{p.paymentDate}</td>
                  <td className="border px-3 py-2">₹{Number(p.amount).toLocaleString()}</td>
                  <td className="border px-3 py-2">{p.paymentMethod}</td>
                  <td className="border px-3 py-2">{p.status}</td>
                  <td className="border px-3 py-2">{p.referenceNo ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
