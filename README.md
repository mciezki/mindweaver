# MindWeaver (Monorepo) 🧠

Welcome to the **MindWeaver** repository. This is a full-stack social and publication platform built with a modern, type-safe stack.

> **🚧 Project Status & Context**
>
> While this is a full-stack monorepo, the current **active development is focused strictly on the Backend API (`apps/backend`)**.
>
> As a **Frontend Developer** by trade, I created this project as a dedicated "playground" to master backend architecture, complex database relationships, raw SQL/Prisma optimization, and API security.
>
> **Future Plans:** Once the backend core is stable, work will resume on the **Next.js Frontend** (`apps/web`) and a dedicated **Mobile Application** (React Native) is planned.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-applications)
- [Scripts](#-scripts)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## ✨ Features

The application is designed as a robust social platform with the following modules:

### 🔐 Authentication & Security (Auth Module)

- **JWT Architecture:** Short-lived Access Tokens and long-lived Refresh Tokens (stored in HTTP-Only cookies).
- **Account Lifecycle:** Registration, Email Activation, Login, and Secure Logout.
- **Password Management:** Secure password reset flows via email tokens.
- **Middleware:** Role-based access control and token verification.

### 💬 Chat System (Chat Module)

A sophisticated 1-on-1 messaging engine:

- **Smart Room Creation:** "Find or Create" logic to handle conversation initialization.
- **Inbox Aggregation:** Complex query logic to fetch conversation lists with **unread message counters**, **last message previews**, and participant data in a single request.
- **Messaging:** Send and receive messages with pagination.
- **Read Receipts:** Functionality to mark conversations as read and update counters.

### 📝 Social & Publications

- **Social Threads:** Create posts with multimedia support.
- **Interactions:** System for Likes and Nested Comments (Threaded discussions).
- **Publications:** Article management system with categories and draft/published states.

---

## 🛠 Tech Stack

This project uses **TurboRepo** for monorepo management.

### **Backend (`apps/backend`)**

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma (Schema validation, Migrations, Type-safe queries)
- **Real-time:** Socket.io _(Implementation in progress)_
- **Auth:** `jsonwebtoken`, `bcryptjs`, `cookie-parser`
- **Email:** Nodemailer

### **Frontend (`apps/web`)**

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI Library:** Material-UI (MUI)
- **State/API:** TanStack Query (React Query), Axios
- **Forms:** React Hook Form, Zod
- **i18n:** react-i18next

### **Shared (`packages/types`)**

- A dedicated package for sharing TypeScript interfaces/types between Backend and Frontend to ensure end-to-end type safety.

---

## 📂 Project Structure

```bash
.
├── apps/
│   ├── backend/    # Express.js API (The current focus)
│   └── web/        # Next.js Frontend
├── packages/
│   └── types/      # Shared TypeScript definitions
├── turbo.json      # TurboRepo configuration
└── package.json    # Root configuration
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** database instance (local or cloud)
- **Git**

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <this-repo-url>
    cd mindweave
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Build shared types:**
    _Crucial step!_ The backend relies on `packages/types`.
    ```bash
    npm run build:types
    ```
    _This command builds the `@mindweave/types` package and reinstalls dependencies in apps to ensure they pick up the latest types._

### Database Setup

1.  Navigate to the backend folder:

    ```bash
    cd apps/backend
    ```

2.  Create a `.env` file based on `.env.example`:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mindweave_db?schema=public"
    JWT_SECRET="YOUR_SUPER_SECRET_KEY"
    JWT_EXPIRES_IN="15m"
    JWT_REFRESH_EXPIRES_IN=7
    # Ethereal Email (for testing)
    EMAIL_HOST=smtp.ethereal.email
    EMAIL_PORT=587
    EMAIL_USER=your_user
    EMAIL_PASS=your_password
    FRONTEND_URL="http://localhost:3000"
    ```

3.  **Run Migrations & Seed:**
    ```bash
    npm run db:setup
    ```
    _This will reset the DB, apply migrations, and seed initial data._

### Running the Applications

From the **root** of the monorepo:

```bash
npm run dev
```

This will concurrently start:

- **Backend API:** `http://localhost:4000/api`
- **Frontend:** `http://localhost:3000`

---

## 📜 Scripts

You can run scripts from the monorepo root or within individual app directories.

- `npm install`: Installs dependencies for all workspaces.
- `npm run dev`: Starts all applications in development mode concurrently.
- `npm run build`: Builds all applications for production.
- `npm run lint`: Lints code across all projects.
- `npm run format`: Formats code using Prettier.
- `npm run check-types`: Runs TypeScript type checking across all projects.
- `npm run build:types`: Builds the shared `@mindweave/types` package and re-installs dependencies in apps. (**Run this after changing types!**)

---

## 🗺️ Roadmap

- [x] **Core:** Monorepo Setup & CI/CD Scripts
- [x] **Backend:** Auth Module (JWT/Cookies)
- [x] **Backend:** Social & Publications Module
- [x] **Backend:** Chat Module (REST API & Logic)
- [ ] **Backend:** WebSockets Integration (Real-time messages/Notifications) _(In Progress)_
- [ ] **Frontend:** Integration with new Backend endpoints
- [ ] **Mobile:** React Native Application

---

## 📄 License

This project is licensed under the ISC License.
