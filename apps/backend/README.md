# MindWeave Backend (API)

This is the backend service for the MindWeave application, built with Express.js and TypeScript. It provides a RESTful API for user authentication, authorization, and data management, interacting with a PostgreSQL database via Prisma.

## Table of Contents

- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Database Management](#database-management)
- [Linting](#linting)

## Technologies

- **Node.js** & **Express.js**
- **TypeScript**
- **Prisma ORM** (for PostgreSQL)
- **JSON Web Tokens (JWT)** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email services (account activation, password reset)
- **cookie-parser** for handling HTTP-only cookies
- **cors** for Cross-Origin Resource Sharing
- **nodemon** for development live-reloading
- **ESLint** for code quality

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)
- PostgreSQL database instance
- Access to the monorepo root for initial setup

### Installation

1.  Navigate to the backend directory:
    ```bash
    cd apps/backend
    ```
2.  Install dependencies (if not already done from monorepo root):
    ```bash
    npm install
    ```
    _Ensure `npm run build:types` was run from the monorepo root to get `@mindweave/types`._

### Environment Variables

Create a `.env` file in the `apps/backend` directory based on the example:

.env
DATABASE_URL="postgresql://user:password@localhost:5432/mindweave_db?schema=public"
JWT_SECRET="YOUR_VERY_SECRET_JWT_KEY"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN=7
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your_ethereal_user
EMAIL_PASS=your_ethereal_password
FRONTEND_URL="http://localhost:3000"

_Adjust values as per your setup._

### Database Setup

Make sure your PostgreSQL database is running.

- **Apply migrations & seed (destructive):**
  ```bash
  npm run db:setup
  # This will reset the database, apply migrations, and run the seed script. Use with caution.
  ```
- **Apply migrations only:**
  ```bash
  npm run db:migrate
  ```
- **Push Prisma schema to database (for development without migrations):**
  ```bash
  npm run db:push
  ```
- **Run seed script:**
  ```bash
  npm run db:seed
  ```
- **Reset database (destructive):**
  ```bash
  npm run db:reset
  ```

### Running the Server

- **Development Mode (with hot-reloading):**
  ```bash
  npm run dev
  # The API will be available at http://localhost:4000/api
  ```
- **Production Mode:**
  ```bash
  npm run build
  npm run start
  # The API will be available at http://localhost:4000/api
  ```

## API Endpoints

The API base URL is `http://localhost:4000/api`.

### Authentication Endpoints (`/api/auth`)

- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Authenticate user and issue `accessToken` and `refreshToken` (HTTP-only cookies).
- `POST /auth/logout`: Revoke `refreshToken` and clear cookies.
- `POST /auth/activate`: Activate user account with email token.
- `POST /auth/request-password-reset`: Request a password reset email.
- `POST /auth/reset-password`: Reset password using a token.
- `POST /auth/refresh`: Obtain new `accessToken` and `refreshToken` using existing `refreshToken`.
- `GET /auth/profile` (Protected): Fetch user profile data. Requires valid `accessToken` in cookie.
- `PATCH /auth/update` (Protected): Update user profile data. Requires valid `accessToken` in cookie.

## Authentication Flow

1.  **Login/Register:** User provides credentials. Backend issues JWT `accessToken` (short-lived) and `refreshToken` (long-lived) as HTTP-only cookies.
2.  **Access Protected Routes:** Frontend makes requests to protected API routes. The browser automatically attaches `accessToken` from the cookie.
3.  **Auth Middleware:** On the backend, `authMiddleware` intercepts requests to protected routes, verifies the `accessToken` from the cookie, and attaches user data to `req.user`.
4.  **Token Expiration & Refresh:** If `accessToken` expires, the frontend's Axios interceptor detects a `401 Unauthorized` response, sends a request to `/api/auth/refresh` with the `refreshToken` from the cookie. Backend issues new tokens.
5.  **Logout:** Frontend calls `/api/auth/logout`. Backend revokes the `refreshToken` in the database and clears both `accessToken` and `refreshToken` cookies.

## Database Management

This project uses Prisma for database interaction. The schema is defined in `prisma/schema.prisma`.

- **Migrations:** Database schema changes are managed via Prisma Migrate.
- **Seeding:** Initial data can be populated using `prisma/seed.ts`.

## Linting

To check for linting errors:

```bash
npm run lint
```
