# CloudCampus — Pending Tasks


> Last Updated: 2026-05-01 | See [13_PROJECT_TRACKER.md](./13_PROJECT_TRACKER.md) for completed work.

---

## Priority Legend

| Icon | Meaning |
|------|---------|
| 🔴 | High Priority |
| 🟡 | Medium Priority |
| 🟢 | Low Priority |

---

## ✅ Completed Since Last Update (2026-05-01)

| Task | Module | Completion Notes |
|------|--------|------------------|
| Task 30 — Teacher Module UI | `frontend/src/features/teacher/` | `TeachersPage.tsx`, `TeacherForm.tsx`, hooks, toast notifications |
| Task 31 — Academic Module UI | `frontend/src/features/academic/` | Classes/Subjects/Sections tabs, forms, `academicApi.ts` |
| Task 33 — Attendance UI | `frontend/src/features/attendance/` | Date picker, class/section selector, bulk mark, report view |
| Task 34 — Fees UI | `frontend/src/features/fees/` | Assignment form, payment form, status badge, payment history |
| Task 35 — Marks/Exams UI | `frontend/src/features/marks/` | Exam form, result entry, results table |
| Task 36 — Homework UI | `frontend/src/features/homework/` | Homework list, create form, overdue highlighting |
| Task 37 — Timetable UI | `frontend/src/features/timetable/` | Weekly grid, slot form, class/section filter |
| Task 38 — Parent Portal UI | `frontend/src/features/parent/` | My children list, per-child view (fees/attendance/results) |
| Task 39 — Ownership-Aware Authorization | Backend/Security | `OwnershipChecker` bean; `@PreAuthorize` ownership on Fees, Attendance, Exam endpoints |
| Task 40 — Audit Logging | Backend (all modules) | `Auditable` MappedSuperclass, `JwtAuditorAware`, `@EnableJpaAuditing`; 10 entities updated |
| Task 41 — Soft Delete | Backend (Student, Teacher, User) | `deleted_at TIMESTAMPTZ`; soft-delete repos; `DELETE /students/{id}`, `DELETE /teachers/{id}` |
| Task 42 — Integration Tests | Testing | Testcontainers + Failsafe; `IntegrationTestBase`; 17 IT tests (tenant provisioning, student CRUD, fee status) |
| Task 45 — Frontend UX Hardening | Frontend (all) | `ConfirmDialog` component; delete student/teacher with confirm dialogs; 401 auto-redirect to correct login route |
| Task 46 — Bulk Upload UI | `frontend/src/features/bulk-upload/` | File picker (.xlsx), drag-and-drop, progress bar, result card, per-row error table, sample download, instructions modal |
| Task 47 — Documentation Update | `docs/`, `docs/postman/` | 07_API_REFERENCE.md, 08_API.md (v1.1), Postman collection: 16 folders, 49 endpoints, legacy folder removed |
| Task 48 — Payment Gateway Integration | Backend + Frontend | Flyway V4; `PaymentGatewayService` interface; `RazorpayPaymentGatewayServiceImpl`; `POST /subscribe/initiate`; `POST /payments/webhook` (HMAC-SHA256 verified); "Pay Online" button + Razorpay checkout.js in `TenantSubscriptionPage`; `12_PAYMENT_FLOW.md` updated to v2 |

---

## ⚠️ In Progress

_None_

---

## ❌ Pending (Not Started)

_None — all planned tasks completed._

