# Routing & Authentication (RBAC)

Food Remit is a **multi-tenant platform** that supports multiple user personas, including Super Admins, Store Managers, and Employees.

The frontend must enforce **Role-Based Access Control (RBAC)** in a secure, predictable, and maintainable way while providing a smooth user experience.

## Route Groups in Next.js

We use **Next.js App Router Route Groups** to organize routes and isolate layouts without affecting the application's public URL structure.

Route groups are represented using folders wrapped in parentheses, for example:

```text id="h5mx0x"
(super-admin)
```

For example:

```text id="u5l4rc"
app/
├── (auth)/
│   ├── login/
│   └── register/
│
└── (private)/
    └── (super-admin)/
        ├── dashboard/
        ├── categories/
        └── items/
```

### Route Group Responsibilities

#### `app/(auth)`

Contains public authentication-related routes, such as:

- Login
- Registration
- Forgot password
- Password reset

These routes should not require an authenticated session.

#### `app/(private)/(super-admin)`

Contains routes that require authentication and appropriate internal permissions.

These routes are intended for authorized users such as:

- Super Admins
- Store Managers
- Other authorized internal staff

Route groups allow us to organize these areas independently without adding `(auth)`, `(private)`, or `(super-admin)` to the actual URL.

---

# Protected Layouts

Access control should primarily be enforced at the **Layout level** rather than repeatedly inside individual pages.

The main private layout is responsible for verifying:

1. **The user has a valid authenticated session.**
2. **The user's role is authorized to access the requested area.**
3. **The required permissions are available for the requested feature.**

If the user does not have the required access, they should be redirected gracefully to an appropriate destination, such as:

- An Unauthorized page
- Their permitted dashboard
- Another appropriate route

Users should never be allowed to reach protected functionality only to encounter runtime UI errors.

### General Principle

> **Protect routes at the boundary, not after the user has already entered the feature.**

Individual components may still perform additional permission checks for specific actions, but the primary route-level protection should happen through the appropriate layouts.

---

# Role-Based Feature Toggles

Within individual pages, specific UI elements may need to be displayed or hidden depending on the user's role or permissions.

Examples include:

- Add buttons
- Edit actions
- Delete actions
- Table columns
- Status controls
- Feature-specific actions

We use the `useProfile` hook to access the authenticated user's profile and relevant permission information.

For example:

```tsx id="u8r6jy"
const { profile, isSuperAdmin, needsBankVerification } = useProfile();

// Only users who are allowed to write
// and are Store Managers can add categories.

const canWrite = !needsBankVerification;

const isStoreManager = profile?.roleCode === "STORE_MANAGER";

return <>{canWrite && isStoreManager && <AddCategoryButton />}</>;
```

This keeps role-based UI behavior explicit and easy to understand.

However, **frontend checks are only for controlling the UI**. They must never be considered the actual security boundary. The backend must independently validate the user's role and permissions before performing protected operations.

---

# Path Permissions

For complex or granular features, simple role checks are often not sufficient.

Features such as a **Content Management System (CMS)** may require dynamic permissions based on specific paths or capabilities.

These permissions are defined centrally in:

```text id="isqvcy"
config/permissions.ts
```

Instead of writing complex role-based conditions directly inside UI components, use the centralized permission utility:

```ts id="y4p0qz"
hasPathPermission(...)
```

For example:

```tsx id="sm0c5b"
const canAccessCMS = hasPathPermission("/cms/categories");
```

This keeps permission logic centralized and prevents different components from implementing inconsistent authorization rules.

### Avoid

```tsx id="smb3je"
profile?.roleCode === "SUPER_ADMIN" || profile?.roleCode === "STORE_MANAGER";
```

when the feature requires a more granular permission model.

### Prefer

```tsx id="j7v4qm"
hasPathPermission("/cms/categories");
```

This makes permission checks easier to maintain as roles and permissions evolve.

---

# General RBAC Principle

RBAC should follow a layered approach:

```text id="7n72ex"
Authentication
      ↓
Protected Layout
      ↓
Role / Path Permission
      ↓
Feature Access
      ↓
Action-Level Permission
      ↓
Backend Authorization
```

Each layer has a specific responsibility:

- **Authentication →** Is the user logged in?
- **Protected Layout →** Can the user access this application area?
- **Role / Permission →** Is the user authorized for this feature?
- **Feature Toggle →** Should this UI element or action be visible?
- **Backend Authorization →** Is the requested operation actually allowed?

The frontend should provide a clean user experience, but the **backend remains the ultimate source of truth for authorization and security**.
