# State Management

In modern React applications, one of the biggest mistakes is treating all state as the same. We strictly separate **Server State** from **Client State** to keep the application predictable, maintainable, and scalable.

## Server State (React Query)

Any data that lives in the database and is fetched or updated through the network is considered **Server State**.

We use `@tanstack/react-query` exclusively for managing Server State.

### Rules for Server State

1. **Never Sync Server State to Local State**

   Do not fetch data with React Query and immediately copy it into `useState`, Context, or another local state container.

   React Query already manages the server data, caching, loading states, refetching, and synchronization. Use the query data directly whenever possible.

2. **Use Predictable Cache Invalidation**

   Whenever a mutation changes server data (for example, updating a category), invalidate the relevant React Query cache key so the affected UI automatically receives the latest data.

```ts
export function useUpdateCategoryStatus(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation("put", `/api/categories/${id}/status`, {
    onSuccess: () => {
      // Invalidate the relevant category queries
      // so the UI automatically receives updated data.
      queryClient.invalidateQueries({
        queryKey: API_CACHE_KEYS.CATEGORIES,
      });
    },
  });
}
```

The goal is to keep a **single source of truth** for server data instead of maintaining duplicate copies across the application.

---

## Client State

Client State represents temporary UI-related state that exists only within the frontend.

Examples include:

- Open/closed dialog state
- Dropdown visibility
- Selected tabs
- Modal state
- Temporary UI preferences
- Uncontrolled or temporary form values

These should generally be managed using local `useState` or other appropriate client-side mechanisms.

### Rules for Client State

1. **Keep State Local**

   Keep state as close as possible to the component that actually needs it.

   For example, if only `CategoryActionsCell` needs to know whether a dropdown is open, the dropdown state should remain inside `CategoryActionsCell` rather than being stored in the parent DataTable or grid.

2. **Use the URL as State for Shareable Table State**

   For searchable, filterable, and paginated tables such as our DataTables, the **URL should be the source of truth**.

   Use query parameters such as:

```text
?page=2&search=dairy
```

This provides several benefits:

- Users can share the current table state.
- Refreshing the page does not lose the current state.
- Browser back/forward navigation works naturally.
- URLs can represent specific filtered or paginated views.

---

## Global Providers

React Context should be reserved for data or functionality that is genuinely global and relatively slow-changing.

Examples include:

### ProfileProvider

Responsible for globally available authenticated-user information such as:

- User profile
- Roles
- Permissions
- Authentication-related information

### Theme / Toast Providers

These provide global UI infrastructure that can be accessed throughout the application.

Examples:

- Theme configuration
- Dark/light mode
- Global toast notifications

### General Principle

The goal is to avoid putting everything into global state.

**Use the right tool for the right type of state:**

- **Server State → React Query**
- **Local UI State → `useState`**
- **Shareable Table/Filter State → URL**
- **Truly Global State → Context/Providers**

This separation keeps the application easier to understand, prevents duplicated state, and makes data flow more predictable.
