# Role Matrix

## Roles

| Role | Scope | Description |
|---|---|---|
| `SUPER_ADMIN` | Platform (public schema) | Platform owner. Manages tenants, plans, payments, and global users. |
| `SCHOOL_ADMIN` | Tenant schema | School administrator. Manages all data within their tenant. |
| `TEACHER` | Tenant schema | Can manage own classes, homework, timetable, marks, attendance. |
| `STUDENT` | Tenant schema | Read-only access to own data (marks, timetable, homework). |
| `PARENT` | Tenant schema | Read-only access to own children's data. |

## Permission Matrix

| Feature / Endpoint | SUPER_ADMIN | SCHOOL_ADMIN | TEACHER | STUDENT | PARENT |
|---|---|---|---|---|---|
| **Tenant Management** | ✅ Full CRUD | ❌ | ❌ | ❌ | ❌ |
| **Subscription Plans** | ✅ Create / View | ✅ View only | ✅ View only | ❌ | ❌ |
| **Assign Plan to Tenant** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Record Payment** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **User Management** | ✅ Create users for any tenant | ✅ Create TEACHER / STUDENT / PARENT | ❌ | ❌ | ❌ |
| **Students** | ❌ | ✅ Full CRUD | ✅ View | ✅ Own data | ❌ |
| **Teachers** | ❌ | ✅ Full CRUD | ✅ Own profile | ❌ | ❌ |
| **Academic Classes / Subjects** | ❌ | ✅ Full CRUD | ✅ View | ✅ View | ❌ |
| **Attendance** | ❌ | ✅ | ✅ Mark & View | ✅ Own | ✅ Children |
| **Fees** | ❌ | ✅ Full CRUD | ❌ | ✅ Own | ✅ Children |
| **Exams / Marks** | ❌ | ✅ Full CRUD | ✅ Enter marks | ✅ Own | ✅ Children |
| **Homework** | ❌ | ✅ | ✅ Create & Manage | ✅ View | ✅ Children |
| **Timetable** | ❌ | ✅ | ✅ View | ✅ View | ✅ View |
| **Bulk Upload** | ❌ | ✅ (PRO+ plan required) | ❌ | ❌ | ❌ |
| **Dashboard** | ✅ Super Admin summary | ✅ Tenant summary | ✅ Tenant summary | ✅ Own | ✅ Own |

## Spring Security Role Enforcement

Roles map to Spring Security authorities as `ROLE_<ROLE_NAME>`:

```java
// Super Admin only
@PreAuthorize("hasRole('SUPER_ADMIN')")

// School Admin or above (within tenant)
@PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'SUPER_ADMIN')")

// Authenticated users with any tenant role
@PreAuthorize("hasAnyRole('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT')")
```

## Token Claims

JWT access tokens include:
```json
{
  "sub": "username",
  "role": "SCHOOL_ADMIN",
  "tenantId": "greenwood",
  "userId": 42
}
```

- `tenantId` is set as `X-Tenant-ID` header in every frontend API request.
- Backend `TenantFilter` reads this header and sets `TenantContext` for schema routing.
- `SUPER_ADMIN` does not have a `tenantId` — requests routed to `public` schema.

## Frontend Route Guards

```tsx
<PrivateRoute allowedRoles={['SUPER_ADMIN']}>
  <SubscriptionPlansPage />
</PrivateRoute>

<PrivateRoute allowedRoles={['SCHOOL_ADMIN', 'TEACHER']}>
  <StudentsPage />
</PrivateRoute>
```

Unauthenticated users are redirected to the appropriate login page.
