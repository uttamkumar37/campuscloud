# CloudCampus — API Reference


> Quick-reference table of all REST endpoints. For full request/response details see [08_API.md](./08_API.md).

**Base URL:** `http://localhost:8080/api/v1`

---

## Authentication

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| POST | `/auth/login` | Login and get JWT token | No | Optional* | All |
| GET | `/auth/me` | Get current user profile | Yes | Yes | All |

> *Omit `X-Tenant-ID` for Super Admin login. Include it for tenant user login.

---

## Tenant Management

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| POST | `/tenants` | Create new school tenant | Yes | No | SUPER_ADMIN |
| GET | `/tenants` | List all tenants | Yes | No | SUPER_ADMIN |
| GET | `/tenants/{tenantId}` | Get tenant by business ID | Yes | No | SUPER_ADMIN |

---

## User Management

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| POST | `/users` | Create staff user account | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN |
| GET | `/users` | List users (paginated) | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN |

---

## Students

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| POST | `/students` | Enroll new student | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN |
| GET | `/students` | List students (paginated) | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER |
| GET | `/students/{id}` | Get student by UUID | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER |
| DELETE | `/students/{id}` | Soft-delete student | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN |

---

## Teachers

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| POST | `/teachers` | Create teacher record | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN |
| GET | `/teachers` | List teachers (paginated) | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER |
| GET | `/teachers/{id}` | Get teacher by UUID | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER |
| DELETE | `/teachers/{id}` | Soft-delete teacher | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN |

---

## Academic (Classes, Subjects, Sections)

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| POST | `/academics/classes` | Create class | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN |
| GET | `/academics/classes` | List all classes | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER |
| POST | `/academics/subjects` | Create subject | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN |
| GET | `/academics/subjects` | List all subjects | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER |
| POST | `/academics/sections` | Create section | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN |
| GET | `/academics/sections` | List all sections | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER |

---

## Attendance

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| POST | `/attendances` | Mark student attendance | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER |
| GET | `/attendances/{id}` | Get attendance record | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT, PARENT |
| GET | `/attendances?date=YYYY-MM-DD` | List attendance by date | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT, PARENT |

---

## Fees

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| POST | `/fees/assignments` | Assign fee to student | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN |
| POST | `/fees/payments` | Record fee payment | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN |
| GET | `/fees/students/{studentId}/assignments` | Get student fee history | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER + ownership |

---

## Exams

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| POST | `/exams` | Schedule exam | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER |
| GET | `/exams/classes/{classId}` | Get exams for class | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT, PARENT |
| POST | `/exams/results` | Enter exam result | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER |
| GET | `/exams/{examId}/results` | Get results for exam (ownership-filtered) | Yes | Yes | SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT, PARENT |

---

## Homework

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| POST | `/homework` | Create homework assignment | Yes | Yes | SCHOOL_ADMIN, TEACHER |
| GET | `/homework/classes/{classId}` | List homework for class | Yes | Yes | SCHOOL_ADMIN, TEACHER, STUDENT, PARENT |

---

## Timetable

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| POST | `/timetable/slots` | Create timetable slot | Yes | Yes | SCHOOL_ADMIN, TEACHER |
| GET | `/timetable/classes/{classId}/sections/{sectionId}` | Get timetable for class & section | Yes | Yes | SCHOOL_ADMIN, TEACHER, STUDENT, PARENT |

---

## Parents

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| GET | `/parents/me/children` | Get linked children for logged-in parent | Yes | Yes | PARENT |

---

## Dashboard

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| GET | `/dashboard/tenant-summary` | School dashboard summary | Yes | Yes | SCHOOL_ADMIN, TEACHER, STUDENT, PARENT |
| GET | `/dashboard/branding` | Tenant branding info | Yes | Yes | SCHOOL_ADMIN, TEACHER, STUDENT, PARENT |
| GET | `/dashboard/super-admin-summary` | Platform-wide summary | Yes | No | SUPER_ADMIN |

---

## Bulk Upload

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| POST | `/bulk/upload` | Upload Excel workbook (multipart) | Yes | Yes | SCHOOL_ADMIN |
| GET | `/bulk/sample` | Download sample XLSX template | Yes | Yes | SCHOOL_ADMIN |

---

## Subscription Plans

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| GET | `/plans` | List active subscription plans | No | No | Public |
| GET | `/plans/{id}` | Get plan by UUID | Yes | No | Any authenticated |
| POST | `/plans` | Create subscription plan | Yes | No | SUPER_ADMIN |

---

## Tenant Subscriptions

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| POST | `/tenants/{tenantId}/subscribe` | Subscribe tenant to a plan | Yes | No | SUPER_ADMIN |
| GET | `/tenants/{tenantId}/subscription` | Get active subscription | Yes | No | SUPER_ADMIN |
| DELETE | `/tenants/{tenantId}/subscription` | Cancel active subscription | Yes | No | SUPER_ADMIN |

---

## Platform Payments

| Method | Endpoint | Description | Auth | X-Tenant-ID | Roles |
|--------|----------|-------------|------|-------------|-------|
| POST | `/payments` | Record platform payment | Yes | No | SUPER_ADMIN |
| GET | `/payments/tenant/{tenantId}` | Get payments for tenant | Yes | No | SUPER_ADMIN |

---

## Key Enum Values

### User Roles

| Value | Description |
|-------|-------------|
| `SUPER_ADMIN` | Platform-level administrator (manages all tenants) |
| `SCHOOL_ADMIN` | School-level administrator (manages own school) |
| `TEACHER` | Teacher (marks attendance, enters results, assigns homework) |
| `STUDENT` | Student (read-only: own data, homework, timetable) |
| `PARENT` | Parent (view linked child's data and fee status) |

### Attendance Status

| Value | Description |
|-------|-------------|
| `PRESENT` | Student was present |
| `ABSENT` | Student was absent |
| `LATE` | Student arrived late |
| `EXCUSED` | Excused absence |

### Fee Assignment Status

| Value | Description |
|-------|-------------|
| `PENDING` | No payments recorded yet |
| `PARTIALLY_PAID` | Some payment made, balance remains |
| `PAID` | Fully paid |
| `OVERDUE` | Past due date with unpaid balance |

### Gender

| Value |
|-------|
| `MALE` |
| `FEMALE` |
| `OTHER` |

### Day of Week (Timetable)

| Value | Day |
|-------|-----|
| `1` | Monday |
| `2` | Tuesday |
| `3` | Wednesday |
| `4` | Thursday |
| `5` | Friday |
| `6` | Saturday |
| `7` | Sunday |

---

## Pagination Query Parameters

All paginated endpoints (`GET /students`, `GET /teachers`, `GET /users`) accept:

| Parameter | Type | Default | Example |
|-----------|------|---------|---------|
| `page` | int | `0` | `page=2` |
| `size` | int | `20` | `size=50` |
| `sort` | string | varies | `sort=lastName,asc` |

---

## Interactive Documentation

Swagger UI is available when the backend is running:

```
http://localhost:8080/swagger-ui.html
```
