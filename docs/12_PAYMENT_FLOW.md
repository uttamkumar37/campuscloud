# CloudCampus — Payment Flow


> Version: 2.0 | Last Updated: 2026-05-01

## Current Model (v2 — Razorpay Gateway)

Online payments via Razorpay are supported alongside the existing manual-payment workflow.

## Subscription Lifecycle

### Manual Flow (Super Admin records payment)
```
Super Admin creates tenant
        ↓
Super Admin assigns a plan via POST /api/v1/tenants/{tenantId}/subscribe
        ↓
TenantSubscription created with status=ACTIVE, paymentStatus=PENDING
        ↓
Payment received (bank transfer / UPI / etc.)
        ↓
Super Admin records payment via POST /api/v1/payments
        ↓
TenantSubscription.paymentStatus updated to PAID
```

### Online Flow (Razorpay)
```
Super Admin opens TenantSubscriptionPage for a tenant
        ↓
Clicks "💳 Pay Online" → POST /api/v1/tenants/{tenantId}/subscribe/initiate
        ↓
Backend creates Razorpay order → stores gateway_order_id on TenantSubscription
        ↓
Returns { orderId, amountInPaise, currency, keyId }
        ↓
Frontend opens Razorpay checkout modal (checkout.js)
        ↓
User completes payment on Razorpay
        ↓
Razorpay sends POST /api/v1/payments/webhook (HMAC-SHA256 signed)
        ↓
Backend verifies signature → matches order → TenantSubscription.paymentStatus = PAID
        ↓
PlatformPayment record created automatically
        ↓
Frontend polls / re-fetches → displays PAID status
```

## API Endpoints

| Action | Method | Path |
|---|---|---|
| List plans | GET | `/api/v1/plans` |
| Create plan | POST | `/api/v1/plans` |
| Subscribe tenant | POST | `/api/v1/tenants/{tenantId}/subscribe` |
| **Initiate online payment** | **POST** | **`/api/v1/tenants/{tenantId}/subscribe/initiate`** |
| Get subscription | GET | `/api/v1/tenants/{tenantId}/subscription` |
| Cancel subscription | DELETE | `/api/v1/tenants/{tenantId}/subscription` |
| Record payment (manual) | POST | `/api/v1/payments` |
| Tenant payment history | GET | `/api/v1/payments/tenant/{tenantId}` |
| **Razorpay webhook** | **POST** | **`/api/v1/payments/webhook`** |

## Data Model

```
SubscriptionPlan
  id, name, price, billingCycleDays, maxStudents, maxTeachers
  features: Set<PlanFeature>
      ↓ (1 plan → many subscriptions)
TenantSubscription
  id, tenantId, plan, startDate, endDate, status, paymentStatus
  gateway_order_id  ← NEW (v2): Razorpay order ID, set on initiate
      ↓ (1 subscription → many payments)
PlatformPayment
  id, tenantId, subscriptionId, amount, status, paymentDate, paymentMethod, referenceNo
```

## Payment Statuses

| Status | Description |
|---|---|
| `PENDING` | Subscription created, payment not yet received |
| `PAID` | Payment recorded/verified (manual or via webhook) |
| `FAILED` | Payment attempt failed |
| `REFUNDED` | Payment reversed |

## Gateway Configuration

Set the following environment variables:

| Variable | Description |
|---|---|
| `RAZORPAY_KEY_ID` | Public API key from Razorpay Dashboard |
| `RAZORPAY_KEY_SECRET` | Secret API key — never expose to frontend |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook secret set in Razorpay Dashboard → Webhooks |

Configure the Razorpay Dashboard to fire the **`payment.captured`** event to:
```
POST https://<your-domain>/api/v1/payments/webhook
```

## Security Model

- `POST /subscribe/initiate` requires `SUPER_ADMIN` Bearer JWT (same as all subscription endpoints).
- `POST /payments/webhook` is **unauthenticated** (no Bearer token) — security is enforced by HMAC-SHA256 signature verification using `RAZORPAY_WEBHOOK_SECRET`.
- Duplicate webhook deliveries are idempotent: a subscription already `PAID` is skipped without side effects.

## Feature Access Guard

`SubscriptionGuardService.requireFeature(PlanFeature)` is called in service methods that should be plan-gated.

**Fail-open rule**: If a tenant has no active subscription (legacy tenant, or newly onboarded before a plan is assigned), ALL features are accessible.

**Fail behaviour**: If an active subscription exists and the plan does NOT include the requested feature, `IllegalStateException` is thrown → HTTP 403.
