# @mindweave/types - Shared Types

This package (`@mindweave/types`) serves as a central repository for shared TypeScript type definitions used across the MindWeave monorepo. Its primary purpose is to ensure type consistency and safety between the frontend (Next.js) and the backend (Express.js/Prisma) applications.

## Table of Contents

-   [Purpose](#purpose)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Development](#development)
-   [Benefits](#benefits)

## Purpose

The main goal of this package is to:

-   Define common data structures (e.g., `User`, `LoginRequest`, `RegisterRequest`, `AuthResponse`) that are exchanged between the frontend and backend.
-   Provide a single source of truth for these types, reducing the risk of discrepancies and bugs.
-   Enable end-to-end type safety in the monorepo, allowing TypeScript to catch type-related errors at compile time.

## Installation

This package is designed to be consumed internally within the MindShare monorepo. It is listed as a dependency in both `apps/backend` and `apps/web`.

To ensure your applications have the latest types:

1.  From the monorepo root, run `npm install` after cloning or fetching new code.
2.  Whenever you make changes to types within this package, run:
    ```bash
    npm run build:types
    ```
    from the monorepo root. This script will build the types and then reinstall dependencies in the `apps/web` and `apps/backend` to ensure they pick up the latest compiled type definitions.

## Usage

You can import types directly into your frontend and backend code:

```typescript
// Example in frontend (Next.js component or hook)
import { User, LoginRequest } from '@mindweave/types';

// Example in backend (Express.js controller or service)
import { AuthResponse, RegisterRequest } from '@mindweave/types';
Development
Type Definitions: All type definitions are located in src/index.ts.

Building Types: To compile the TypeScript files into JavaScript (.js) and declaration files (.d.ts), use the build script:

Bash

cd packages/types
npm run build
This command is automatically triggered by npm run build:types from the monorepo root.

Benefits
Reduced Errors: Catches type mismatches between frontend and backend during development.

Improved Developer Experience: Provides auto-completion and type checking in IDEs.

Easier Maintenance: Changes to data structures are propagated consistently across the entire application.

Clearer Communication: Serves as a clear contract for data exchange.







