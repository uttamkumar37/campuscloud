# CloudCampus — Pricing Plans


> Version: 1.0 | Last Updated: 2026-04-28

CloudCampus offers four tiers. All plans include core school management. Advanced features are gated by plan.

## Plan Comparison

| Feature | FREE | BASIC | PRO | ENTERPRISE |
|---|---|---|---|---|
| **Price / cycle** | ₹0 | ₹2,999 / 30 days | ₹7,999 / 30 days | Custom |
| **Max Students** | 50 | 300 | 1,500 | Unlimited |
| **Max Teachers** | 5 | 30 | 150 | Unlimited |
| Student Management | ✅ | ✅ | ✅ | ✅ |
| Teacher Management | ✅ | ✅ | ✅ | ✅ |
| Dashboard Access | ✅ | ✅ | ✅ | ✅ |
| Attendance Tracking | ❌ | ✅ | ✅ | ✅ |
| Fee Management | ❌ | ✅ | ✅ | ✅ |
| Academic Management | ❌ | ✅ | ✅ | ✅ |
| Exam Management | ❌ | ✅ | ✅ | ✅ |
| Homework Management | ❌ | ✅ | ✅ | ✅ |
| Timetable Management | ❌ | ✅ | ✅ | ✅ |
| Bulk Upload | ❌ | ❌ | ✅ | ✅ |
| Parent Portal | ❌ | ❌ | ✅ | ✅ |
| Advanced Reports | ❌ | ❌ | ✅ | ✅ |
| Custom Branding | ❌ | ❌ | ❌ | ✅ |

## Feature Access Matrix (Code Enum → Plan)

| `PlanFeature` | FREE | BASIC | PRO | ENTERPRISE |
|---|---|---|---|---|
| `STUDENT_MANAGEMENT` | ✅ | ✅ | ✅ | ✅ |
| `TEACHER_MANAGEMENT` | ✅ | ✅ | ✅ | ✅ |
| `DASHBOARD_ACCESS` | ✅ | ✅ | ✅ | ✅ |
| `ATTENDANCE_TRACKING` | ❌ | ✅ | ✅ | ✅ |
| `FEE_MANAGEMENT` | ❌ | ✅ | ✅ | ✅ |
| `ACADEMIC_MANAGEMENT` | ❌ | ✅ | ✅ | ✅ |
| `EXAM_MANAGEMENT` | ❌ | ✅ | ✅ | ✅ |
| `HOMEWORK_MANAGEMENT` | ❌ | ✅ | ✅ | ✅ |
| `TIMETABLE_MANAGEMENT` | ❌ | ✅ | ✅ | ✅ |
| `BULK_UPLOAD` | ❌ | ❌ | ✅ | ✅ |
| `PARENT_PORTAL` | ❌ | ❌ | ✅ | ✅ |
| `ADVANCED_REPORTS` | ❌ | ❌ | ✅ | ✅ |
| `CUSTOM_BRANDING` | ❌ | ❌ | ❌ | ✅ |

## Plan Limits

- **maxStudents = -1** means unlimited (ENTERPRISE).
- When a tenant exceeds their plan limit (future enforcement), the API will return `HTTP 403` with a message to upgrade.
- Current enforcement is feature-based only via `SubscriptionGuardService.requireFeature()`.

## Upgrade Path

`FREE → BASIC → PRO → ENTERPRISE`

Upgrading cancels the current active subscription and creates a new one (no prorated refund in v1).
