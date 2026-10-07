# Food Remit Frontend Documentation

Welcome to the **central engineering documentation for the Food Remit frontend application**.

As Food Remit continues to grow, maintaining a **clean, scalable, predictable, and modular codebase** is essential. This documentation serves as the **single source of truth** for our frontend architecture, development patterns, design standards, and engineering practices.

The goal is not only to document **how** the application is built, but also **why** certain architectural and technical decisions have been made.

Whether you're **onboarding a new engineer, developing a new feature, refactoring existing code, or debugging a complex issue**, these documents should provide the necessary guidance to keep the codebase consistent and maintainable.

---
## 📚 Documentation Index

### 1. Architecture & Folder Structure

**[1-ARCHITECTURE.md](./1-ARCHITECTURE.md)**

Defines the overall frontend architecture and project organization.

This document covers:

- Feature-Sliced Design (FSD) principles
- Next.js App Router architecture
- Folder and module organization
- Layer responsibilities and boundaries
- Module dependencies
- Reusability and separation of concerns
- Guidelines for adding new features and modules

---

### 2. State Management

**[2-STATE_MANAGEMENT.md](./2-STATE_MANAGEMENT.md)**

Defines how state is managed across the application.

This document covers:

- Server State vs. Client State
- React Query / TanStack Query
- Local component state
- Global client state
- Query caching strategies
- Cache invalidation
- Optimistic updates
- Performance considerations
- Guidelines for deciding where new state should live

---

### 3. UI & Styling Standards

**[3-UI_AND_STYLING.md](./3-UI_AND_STYLING.md)**

Defines the standards for building a consistent and responsive user interface.

This document covers:

- Tailwind CSS conventions
- Shadcn UI components
- Responsive design principles
- Breakpoints and mobile-first development
- Component reusability
- Design consistency
- The `cn` utility and conditional class handling
- Spacing, typography, and layout conventions
- Guidelines for creating or extending UI components

---

### 4. API Integration & Data Fetching

**[4-API_AND_DATA.md](./4-API_AND_DATA.md)**

Defines how the frontend communicates with backend services and manages API data.

This document covers:

- Axios configuration and lifecycle
- Request and response interceptors
- Authentication handling
- API error handling
- Standardized API responses
- React Query data fetching
- Query keys and caching
- Cache invalidation
- Loading and error states
- API-related performance and reliability practices

---

### 5. Routing & Authentication (RBAC)

**[5-ROUTING_AND_AUTH.md](./5-ROUTING_AND_AUTH.md)**

Defines how application routing, authentication, authorization, and role-based access are handled.

This document covers:

- Next.js App Router
- Protected routes
- Authentication flows
- Layout-level protection
- Role-Based Access Control (RBAC)
- Role-specific permissions
- Super Admin access
- Store Manager / Store Admin access
- Employee access
- Route and feature-level authorization
- Handling unauthorized access

---

## 🧭 Engineering Principles

While implementing new features or modifying existing functionality, engineers should follow these core principles:

### 1. Keep Modules Focused

Each module should have a clear responsibility. Avoid placing unrelated business logic, UI logic, API calls, and state management in a single file or comp
