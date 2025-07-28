# MindWeave Frontend (Web)

This is the frontend application for the MindWeave project, built with Next.js and Material-UI. It provides a responsive and intuitive user interface for interacting with the backend API.

## Table of Contents

- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Key Features & Concepts](#key-features--concepts)
  - [Authentication Flow](#authentication-flow)
  - [Next.js Middleware](#nextjs-middleware)
  - [API Client](#api-client)
  - [Form Handling](#form-handling)
  - [Internationalization](#internationalization)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Linting](#linting)

## Technologies

- **Next.js 15** (React Framework)
- **Material-UI (MUI)** for UI components
- **TanStack Query (React Query)** for data fetching, caching, and state management
- **Axios** for HTTP client
- **React Hook Form** for form management
- **Zod** for schema validation
- **react-i18next** for internationalization (i18n)
- **TypeScript** for type safety
- **ESLint** for code quality

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)
- Access to the monorepo root for initial setup
- MindShare Backend running (usually at `http://localhost:4000/api`)

### Installation

1.  Navigate to the frontend directory:
    ```bash
    cd apps/web
    ```
2.  Install dependencies (if not already done from monorepo root):
    ```bash
    npm install
    ```
    _Ensure `npm run build:types` was run from the monorepo root to get `@mindweave/types`._

### Environment Variables

Create a `.env.local` file in the `apps/web` directory:

.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api

_Adjust the API base URL if your backend runs on a different address/port._

### Running the Application

- **Development Mode:**
  ```bash
  npm run dev
  # The frontend will be available at http://localhost:3000
  ```
- **Production Mode:**
  ```bash
  npm run build
  npm run start
  # The frontend will be available at http://localhost:3000
  ```

## Key Features & Concepts

### Authentication Flow

The frontend interacts with the backend for secure user authentication using HTTP-only cookies and JWTs:

- **Login/Registration:** Sends credentials to the backend. The backend responds by setting `accessToken` and `refreshToken` as HTTP-only cookies.
- **Protected Routes:** For any protected route, the browser automatically sends these cookies with the request.
- **Axios Interceptors:** An Axios interceptor automatically handles `401 Unauthorized` responses:
  1.  It attempts to refresh the `accessToken` using the `refreshToken`.
  2.  If refresh is successful, the original failed request is retried.
  3.  If refresh fails, the user is redirected to the login page.
- **Logout:** Clears the authentication state and triggers a backend call to revoke the refresh token and clear all associated cookies.

### Next.js Middleware

A Next.js middleware (`src/middleware.ts`) is used to protect frontend routes:

- It checks for the presence of the `accessToken` cookie.
- If a user is logged in and tries to access public authentication pages (`/login`, `/sign-up`, `/`), they are redirected to `/dashboard`.
- If an unauthenticated user tries to access private routes (`/dashboard`, `/profile`, `/settings`), they are redirected to `/login`.

### API Client

- **`src/utils/api/axiosInstance.ts`**: Configures Axios with `withCredentials: true` to send and receive HTTP-only cookies. Includes an interceptor for automatic token refreshing.
- **`src/hooks/api`**: Custom React Query hooks (e.g., `useLogin`, `useActivateAccount`) encapsulate API interactions, providing loading states, error handling, and caching.

### Form Handling

- **React Hook Form:** Manages form state, validation, and submission efficiently.
- **Zod:** Used for schema-based validation of form inputs, ensuring data integrity.

### Internationalization (i18n)

- **`react-i18next`**: Supports multiple languages for the user interface, with translations stored in `public/locales`.

## Project Structure

.
├── public/ # Static assets and i18n translation files
├── src/
│ ├── app/ # Next.js App Router pages and layouts
│ ├── components/ # Reusable UI components (Material-UI based)
│ ├── hooks/
│ │ └── api/ # Custom React Query hooks for API interaction
│ │ └── public/ # Hooks for public API endpoints (login, register)
│ ├── utils/ # Utility functions and configurations
│ │ ├── api/ # Axios instance, API types
│ │ ├── i18n/ # i18n configuration and translation helpers
│ │ ├── paths.ts # Defined application routes
│ │ └── validators/ # Zod schemas for form validation
│ ├── middleware.ts # Next.js authentication middleware
│ └── globals.css # Global styles
├── .env.local.example
├── next.config.js
├── package.json
└── README.md # This file

## Scripts

- **`npm run dev`**: Starts the Next.js development server with Turbopack.
- **`npm run build`**: Builds the Next.js application for production.
- **`npm run start`**: Starts the Next.js production server.
- **`npm run lint`**: Runs ESLint for code quality checks.

## Linting

To check for linting errors:

```bash
npm run lint
```
