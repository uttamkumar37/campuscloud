# Payment Flow

## Current Model (v1 — Manual)

All payments are manually recorded by the Super Admin. No automated payment gateway is integrated in v1.

## Subscription Lifecycle

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
        ↓
Subscription expires on endDate (manual or automated renewal)
```

## API Endpoints

| Action | Method | Path |
|---|---|---|
| List plans | GET | `/api/v1/plans` |
| Create plan | POST | `/api/v1/plans` |
| Subscribe tenant | POST | `/api/v1/tenants/{tenantId}/subscribe` |
| Get subscription | GET | `/api/v1/tenants/{tenantId}/subscription` |
| Cancel subscription | DELETE | `/api/v1/tenants/{tenantId}/subscription` |
| Record payment | POST | `/api/v1/payments` |
| Tenant payment history | GET | `/api/v1/payments/tenant/{tenantId}` |

## Data Model

```
SubscriptionPlan
  id, name, price, billingCycleDays, maxStudents, maxTeachers
  features: Set<PlanFeature>
      ↓ (1 plan → many subscriptions)
TenantSubscription
  id, tenantId, plan, startDate, endDate, status, paymentStatus
      ↓ (1 subscription → many payments)
PlatformPayment
  id, tenantId, subscriptionId, amount, status, paymentDate, paymentMethod, referenceNo
```

## Payment Statuses

| Status | Description |
|---|---|
| `PENDING` | Subscription created, payment not yet received |
| `PAID` | Payment recorded and verified |
| `FAILED` | Payment attempt failed |
| `REFUNDED` | Payment reversed |

## Feature Access Guard

`SubscriptionGuardService.requireFeature(PlanFeature)` is called in service methods that should be plan-gated.

**Fail-open rule**: If a tenant has no active subscription (legacy tenant, or newly onboarded before a plan is assigned), ALL features are accessible. This ensures backward compatibility.

**Fail behaviour**: If an active subscription exists and the plan does NOT include the requested feature, `IllegalStateException` is thrown with a user-friendly message. The global exception handler translates this to HTTP 403.

## Future: Payment Gateway Integration

When a payment gateway (Razorpay / Stripe) is integrated:

1. Add gateway-specific fields to `PlatformPayment` (gateway order ID, webhook payload hash).
2. Add a webhook endpoint (`POST /api/v1/payments/webhook/{gateway}`) secured by HMAC signature verification.
3. Automate `TenantSubscription.paymentStatus` update on successful webhook event.
4. Auto-expire subscriptions via a scheduled job (`@Scheduled`) that sets `status = EXPIRED` when `endDate < today`.

No code changes are needed to the plan/feature model — the guard service and data model are gateway-agnostic.
