# MindWeave - Monorepo

Welcome to the MindWeave Monorepo! This repository hosts a full-stack application designed to provide a robust and secure platform. It's built with a modern tech stack including Next.js for the frontend, Express.js with Prisma for the backend, and a shared `types` package for consistent data structures across the applications.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the Applications](#running-the-applications)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Authentication & Authorization](#authentication--authorization)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication:** Secure registration, login, logout, and password management.
  - Account activation via email.
  - Password reset functionality.
- **JWT-based Authentication:** Secure access and refresh tokens.
- **HTTP-only Cookies:** Enhanced security for storing tokens, protecting against XSS attacks.
- **Robust API:** RESTful API for user management and future functionalities.
- **Responsive UI:** Modern and intuitive user interface built with Material-UI.
- **Type-Safe Development:** End-to-end type safety using TypeScript.

## Technologies

This monorepo leverages the following key technologies:

- **Monorepo Tool:** [TurboRepo](https://turbo.build/)
- **Frontend:** [Next.js](https://nextjs.org/) (React, App Router, TypeScript)
  - UI Library: [Material-UI](https://mui.com/)
  - State Management & API Calls: [TanStack Query](https://tanstack.com/query) (React Query), [Axios](https://axios-http.com/)
  - Form Handling & Validation: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
  - Internationalization: [react-i18next](https://react.i18next.com/)
- **Backend:** [Express.js](https://expressjs.com/) (Node.js, TypeScript)
  - ORM: [Prisma](https://www.prisma.io/) (for PostgreSQL database)
  - Authentication: [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), [bcryptjs](https://www.npmjs.com/package/bcryptjs)
  - Email Service: [Nodemailer](https://nodemailer.com/)
  - Cookie Management: [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- **Shared:**
  - `packages/types`: Custom TypeScript type definitions for shared data structures.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL database instance
- Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <this-repo-url>
    cd mindweave
    ```
2.  **Install root dependencies:**
    ```bash
    npm install
    ```
3.  **Build shared types:**
    This step is crucial as the frontend and backend depend on these types.
    ```bash
    npm run build:types
    ```
    This command will build the `@mindweave/types` package and then reinstall dependencies in `apps/web` and `apps/backend` to ensure they pick up the latest types.

### Database Setup

1.  **Ensure PostgreSQL is running.**
2.  **Create a `.env` file in `apps/backend`** based on `apps/backend/.env.example`.
    ```
    # apps/backend/.env
    DATABASE_URL="postgresql://user:password@localhost:5432/mindweave_db?schema=public"
    JWT_SECRET="YOUR_VERY_SECRET_JWT_KEY"
    JWT_EXPIRES_IN="15m" # e.g., 15 minutes for access token
    JWT_REFRESH_EXPIRES_IN=7 # e.g., 7 days for refresh token
    EMAIL_HOST=smtp.ethereal.email
    EMAIL_PORT=587
    EMAIL_USER=your_ethereal_user
    EMAIL_PASS=your_ethereal_password
    # Add FRONTEND_URL if needed for email links (e.g., for password reset or activation)
    FRONTEND_URL="http://localhost:3000"
    ```
    *Replace placeholders with your actual database credentials and other settings.* For testing emails, consider using [Ethereal Email](https://ethereal.email/).
3.  **Run Prisma migrations and seed the database:**
    ```bash
    cd apps/backend
    npm run db:setup
    # This command will:
    # - Reset your database
    # - Apply all pending migrations (creating tables)
    # - Run the seed script (populating initial data)
    ```
    If you only need to apply migrations without resetting, use `npm run db:migrate`.

### Running the Applications

From the monorepo root:

bash
npm run dev
# This will concurrently start both the backend and frontend in development mode.
Frontend: Accessible at http://localhost:3000

Backend API: Accessible at http://localhost:4000/api

### Project Structure
.
├── apps/
│   ├── backend/          # Express.js API (Node.js, TypeScript, Prisma)
│   └── web/              # Next.js Frontend (React, TypeScript, Material-UI)
├── packages/
│   └── types/            # Shared TypeScript type definitions
├── .eslintrc.js
├── .prettierrc.js
├── package.json          # Root monorepo configuration
├── turbo.json            # TurboRepo configuration
└── README.md             # This file

### Scripts
You can run scripts from the monorepo root or within individual app directories.

`npm install`: Installs dependencies for all workspaces.
`npm run dev`: Starts all applications in development mode concurrently.
`npm run build`: Builds all applications for production.
`npm run lint`: Lints code across all projects.
`npm run format`: Formats code using Prettier.
`npm run check-types`: Runs TypeScript type checking across all projects.
`npm run build:types`: Builds the shared @mindweave/types package and re-installs dependencies in apps. (Crucial after type changes)

Refer to individual README.md files in apps/backend, apps/web, and packages/types for more specific scripts.

### Authentication & Authorization
This application implements a robust authentication and authorization system:

Access Token (JWT): Short-lived, used for authenticating requests to protected API routes. Stored in an HTTP-only cookie.

Refresh Token (JWT): Long-lived, used to obtain a new access token when the current one expires, without requiring re-login. Stored in an HTTP-only cookie and revoked from the database upon logout or refresh.

Middleware-based Security:

Frontend uses Next.js Middleware to protect routes and redirect unauthenticated users.

Backend uses an authMiddleware to verify accessToken from cookies for protected API endpoints.

Account Activation: New users must activate their account via an email token for enhanced security.

Password Reset: Secure mechanism for users to reset forgotten passwords via email token.

### Contributing
Contributions are not needed.

### License
This project is licensed under the ISC License. See the LICENSE file for details.