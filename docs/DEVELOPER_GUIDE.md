# Food Remit Frontend — Engineering & Architecture Guide

Welcome to the **Food Remit** frontend engineering documentation. This codebase is architected using **Next.js 16 App Router** with a **Domain-Driven Feature-Sliced Architecture**.

---

## 1. Directory Structure & Layer Responsibilities

```text
food-remit-fe/
├── app/                  # PURE ROUTING (Thin route definitions & layouts)
├── feature/              # DOMAIN MODULES (Super Admin, Store Admin, Shared, Public)
├── components/           # REUSABLE UI PRIMITIVES & COMPOUND WIDGETS
│   ├── ui/               # Low-level Shadcn UI primitives (Button, Dialog, Input)
│   ├── layout/           # Global shell components (AppTopBar, LogoutButton, Sidebar)
│   ├── feedback/         # Application feedback & guard screens (AccessDenied, ProfileError)
│   ├── common/           # Domain-agnostic compound widgets (DataTable, PageHeader, Selects)
│   └── toaster/          # Toast notification system
├── providers/            # APP INFRASTRUCTURE & CONTEXT PROVIDERS
├── config/               # STATIC CONFIGURATION & VALIDATED RUNTIME ENV
├── lib/                  # CORE UTILITIES, API CLIENT, & STORAGE
│   ├── api/              # Axios client, cache keys, & endpoint definitions
│   └── utils/            # Shared formatting, date, phone, & currency helpers
├── hooks/                # REUSABLE REACT HOOKS
├── constants/            # GLOBAL PLATFORM CONSTANTS
└── types/                # GLOBAL & AMBIENT TYPES
```

---

## 2. Standard Feature Module Anatomy

Every feature module inside `feature/` must follow strict domain colocation:

```text
feature/private/(super-admin)/catalogue-management/items/
├── components/           # Feature-specific components
├── hooks/                # Feature-specific queries, mutations, & filters
├── constants/            # Feature-specific constants & status options
├── columns/              # TanStack table columns
├── types/                # Domain TypeScript models
├── utils/                # Feature calculations & display normalizers
└── index.tsx             # Public entry point rendered by app/
```

### Golden Rule of Features

- **Keep it colocated**: If a component, hook, or constant is only used by this feature, do **not** put it in `@/components` or `@/constants`. Keep it inside the feature.
- **Promote only when shared by 3+ modules**: Move components to `@/components/common` only when reused across multiple independent business domains.

---

## 3. Importing Code: Standard Conventions

Always use the configured path aliases rather than long relative paths:

```tsx
// 1. App Configuration & Validated Environment
import { ROUTES, env } from "@/config";

// 2. Application Context & Providers
import { useProfile, AppProviders } from "@/providers";

// 3. UI Components & Layouts
import { PageHeader, StatusBadge, DataTable } from "@/components/common";
import { AppTopBar } from "@/components/layout";
import { AccessDeniedScreen } from "@/components/feedback";

// 4. API & Network Gateway
import { apiClient, API_CACHE_KEYS, CATALOGUE_ENDPOINTS } from "@/lib/api";
import { useApiQuery, useApiMutation } from "@/hooks";

// 5. Utilities, Formatting & Logging
import { cn, formatDate, getCurrencySymbol, logger, safeStorage } from "@/lib";

// 6. Global Types
import type { ApiResponse, PaginatedResponse } from "@/types";
```

---

## 4. Environment Variables Validation

All environment variables are strictly validated at boot time via Zod in `@/config/env.ts`.

- **Never use `process.env` directly in feature components.**
- Always import `env` from `@/config`:
  ```tsx
  import { env } from "@/config";
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
  ```
- If an environment variable is missing, the application fails fast at boot with a detailed terminal error.

---

## 5. Logging Standard

Do not use raw `console.log()` statements in production code. Use the centralized logger:

```tsx
import { logger } from "@/lib";

logger.debug("Component mounted with props", props);
logger.info("Order processed successfully", orderId);
logger.warn("Slow API response detected", duration);
logger.error("Failed to submit form", error);

// Or create a tagged module logger:
const log = logger.withTag("CatalogueManager");
log.info("Loading categories");
```

---

## 6. Safe Storage Standard

For storing browser data (like user preferences or draft filters), use `safeStorage`:

```tsx
import { safeStorage } from "@/lib";

// Safe against SSR errors and Incognito mode blocks:
safeStorage.local.set("user_prefs", { theme: "light" });
const prefs = safeStorage.local.get("user_prefs");
```

---

## 7. Verification & Quality Gates

Before committing code:

```bash
# Verify TypeScript compilation (0 errors allowed)
pnpm run typecheck

# Verify ESLint code standards
pnpm run lint
```
