# Food Remit Frontend

## 🏗 Architecture & Folder Structure

This project follows a scalable, domain-driven structure adapted for Next.js App Router.

### Core Directories

- **`app/`**: strictly for Next.js routing, layouts, and API routes. Keep UI components out of here.
- **`core/`**: application-level configuration, global providers (`AppProviders`), and base generic utilities.
- **`shared/`**: dumb, reusable UI components (e.g. Buttons, Modals), custom generic hooks, and global types. Does not contain any business logic.
- **`features/`**: isolated domain modules (e.g., `auth`, `catalogue`, `stores`). This is where the business logic, specialized hooks, and smart components live.

### 📜 Standards Enforced

- **Node.js**: v20+ strictly enforced via `.nvmrc` and `.npmrc` (`engine-strict=true`).
- **Package Manager**: pnpm v9+
- **Auto Peer Dependencies**: enabled via `.npmrc`.

### 🚀 Getting Started

1. Run `nvm use` to switch to the correct Node version.
2. Run `pnpm install` to install dependencies.
3. Run `pnpm run dev` to start the development server.
