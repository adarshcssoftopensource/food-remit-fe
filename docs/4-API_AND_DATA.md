# API Integration & Data Flow

All communication with the backend must be **strictly typed, centralized, and consistent** across the application.

Our API architecture is designed to provide centralized request handling, automatic authentication management, consistent error handling, and predictable data flow.

## The API Client (`apiClient`)

All network requests must go through our configured Axios instance located at:

```text
lib/api/client.ts
```

Direct usage of `fetch()` or creating separate Axios instances within features is not allowed.

### Why Not Standard `fetch`?

Our centralized Axios instance includes custom interceptors that handle common API concerns automatically.

These interceptors are responsible for:

- Automatically injecting Bearer authentication tokens.
- Handling `401 Unauthorized` responses.
- Attempting token refresh when applicable.
- Redirecting the user to the login page when authentication can no longer be restored.
- Globally handling specific API failure scenarios.
- Triggering generic toast notifications where appropriate.

This prevents repetitive authentication and error-handling logic from being duplicated across individual components and hooks.

---

## Endpoints Dictionary

API URLs must never be hardcoded directly inside components or React Query hooks.

All endpoints should be defined centrally inside:

```text
lib/api/endpoints/
```

This provides a single source of truth for backend routes and makes future API versioning or route changes easier to manage.

For example:

```ts
export const CATALOGUE_MANAGEMENT_ENDPOINTS = {
  CATEGORIES: "/api/categories",

  DELETE_CATEGORY: (id: string) => `/api/categories/${id}`,

  // ...
};
```

Instead of:

```ts
// ❌ BAD

useApiMutation("delete", `/api/categories/${id}`);
```

Use:

```ts
// ✅ GOOD

useApiMutation("delete", CATALOGUE_MANAGEMENT_ENDPOINTS.DELETE_CATEGORY(id));
```

This keeps API routes consistent and prevents duplicated or outdated URLs throughout the codebase.

---

# React Query Hooks

All API interactions should be encapsulated inside custom React Query hooks.

Examples:

```text
useGetCategories
useDeleteCategory
useUpdateCategory
useCreateCategory
```

Components should consume these hooks rather than directly calling the API client.

This keeps components focused on presentation and user interaction while API-related logic remains inside the appropriate feature or hook.

## Queries (`useQuery`)

Use `useQuery` for retrieving server data.

React Query automatically handles:

- Loading states
- Error states
- Caching
- Background refetching
- Request deduplication
- Query synchronization

Example:

```ts
export function useGetCategories() {
  return useQuery({
    queryKey: API_CACHE_KEYS.CATEGORIES,
    queryFn: () => apiClient.get(CATALOGUE_MANAGEMENT_ENDPOINTS.CATEGORIES),
  });
}
```

---

## Mutations (`useMutation` / `useApiMutation`)

Use mutations whenever the application modifies server-side data.

Examples include:

- Creating records
- Updating records
- Deleting records
- Changing status
- Bulk operations

Every successful mutation that changes cached server data must invalidate the relevant query keys.

```ts
export function useDeleteCategory(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation("delete", CATALOGUE_MANAGEMENT_ENDPOINTS.DELETE_CATEGORY(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: API_CACHE_KEYS.CATEGORIES,
      });
    },
  });
}
```

This ensures that the UI automatically reflects the latest server state.

---

# Cache Keys

All React Query cache keys must be defined centrally in:

```text
lib/api/cache-keys.ts
```

Never define important cache keys as random strings directly inside individual components or hooks.

For example:

```ts
export const API_CACHE_KEYS = {
  CATEGORIES: ["categories"],
  ITEMS: ["items"],
};
```

Then use the centralized keys consistently:

```ts
useQuery({
  queryKey: API_CACHE_KEYS.CATEGORIES,
  // ...
});
```

And when invalidating:

```ts
queryClient.invalidateQueries({
  queryKey: API_CACHE_KEYS.CATEGORIES,
});
```

Centralizing cache keys prevents spelling mistakes and inconsistent query keys that could cause cache invalidation or refetching to fail.

---

# General Data Flow

The expected data flow throughout the application is:

```text
Component
    ↓
Custom React Query Hook
    ↓
apiClient
    ↓
API Endpoint
    ↓
Backend
    ↓
Response
    ↓
React Query Cache
    ↓
Component
```

For mutations:

```text
User Action
    ↓
Mutation Hook
    ↓
apiClient
    ↓
Backend
    ↓
Success
    ↓
Invalidate Relevant Cache
    ↓
React Query Refetches Data
    ↓
Updated UI
```

### Core Principle

**Components should not manage API infrastructure.**

Keep responsibilities clearly separated:

- **`apiClient` →** Network and authentication handling
- **Endpoints →** API route definitions
- **React Query hooks →** Server-state interaction
- **Cache keys →** Query identity and invalidation
- **Components →** UI and user interaction

This structure keeps API integration predictable, reusable, and easy to maintain as the Food Remit application grows.
