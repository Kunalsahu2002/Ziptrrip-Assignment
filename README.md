# TaskFlow — Ziptrrip Todo Assignment

> A full-stack, production-structured Todo application built with **React (MPA) + Node.js/Express + PostgreSQL + TypeScript**.

---

## Assignment Requirements & Extra Points

| Requirement | Implementation | Status |
|---|---|---|
| React frontend | React 19 with TypeScript | ✅ |
| **Genuine MPA** (not SPA) | Two separate HTML entry points (`todos.html`, `todo.html`) — no React Router | ✅ |
| Todo list page with features | Dashboard with creation form, filtering, completion toggle, delete | ✅ |
| Single todo detail page | `todo.html?id=<uuid>` — reads ID via `URLSearchParams`, full detail view | ✅ |
| JS/TS backend server | Node.js + Express 5 + TypeScript (strict mode) | ✅ |
| CRUD APIs for todos | POST / GET / GET :id / PATCH / DELETE — all 5 endpoints | ✅ |
| Persistent storage | PostgreSQL via Prisma 7 ORM + migrations | ✅ |
| Unit tests *(mandatory for backend)* | 10 unit tests — `todoService` fully tested with mocked repository | ✅ |
| Postman / REST Client *(mandatory for backend)* | Both provided: `backend/postman/` and `backend/rest-client/` | ✅ |
| **TypeScript** *(extra points)* | 100% TypeScript — backend and frontend, strict compiler flags | ✅ |
| **Database** *(extra points)* | PostgreSQL with Prisma migrations | ✅ |
| **Coding organization** *(extra points)* | Route → Controller → Service → Repository layering | ✅ |
| **Unit tests** *(extra points)* | 30 tests total: 10 unit + 20 integration (Vitest + Supertest) | ✅ |
| **Postman / REST Client** *(extra points)* | 10-request Postman collection + comprehensive `.http` file | ✅ |
| Features documented in `.md` files | `FEATURES.md`, `API.md`, `ARCHITECTURE.md`, `DECISIONS.md` | ✅ |

---

## Engineering Highlights

| Area | What was done |
|---|---|
| **TypeScript** | Strict TS throughout. Backend uses `node16` module resolution. Frontend uses `verbatimModuleSyntax`. |
| **PostgreSQL / Database** | Prisma 7 with driver adapter (`@prisma/adapter-pg`). Schema versioned via migrations, not raw SQL. |
| **Clean Architecture** | Strict 4-layer separation: Routes → Controllers → Services → Repositories. Controllers handle HTTP; Services handle business logic; Repositories handle all DB access. |
| **Validation** | All endpoints validate with Zod schemas before controllers run. UUID params, enums, string lengths, and at-least-one-field-update are all enforced. |
| **Error Handling** | Centralized `errorHandler` middleware. Custom `AppError` class carries HTTP status + error code. Errors never leak stack traces to clients. |
| **Security** | `helmet` (secure headers), `cors` (configurable origin), `express-rate-limit` (100 req/15 min), request body size limit (10 KB). |
| **Testing** | 10 unit tests (mocked repository, zero DB) + 20 integration tests (real PostgreSQL test DB, Supertest). All 30 pass. |
| **Genuine MPA** | Two separate HTML files, two separate Vite entry points, two separate JS bundles. Navigating between pages causes a real browser document reload — provable from the Network tab. |
| **API Clients** | Postman collection with 10 requests (including error cases). VS Code REST Client `.http` file. |

---

## Project Overview

**TaskFlow** is a Todo management application covering:

- Creating, reading, updating, and deleting tasks with priorities and due dates
- Filtering tasks by status (All / Active / Completed)
- Viewing full task detail on a separate page
- A secure, validated REST API backed by a real PostgreSQL database

---

## Feature List

### Frontend
- **Two separate pages** (MPA — not SPA):
  - **`/todos.html`** — Dashboard: Statistics summary, task list, creation modal, status filter tabs
  - **`/todo.html?id=<uuid>`** — Task detail view: full info, metadata grid, complete/delete actions
- Statistics cards: Total, Active, Completed, Overdue (dynamically computed)
- Create task modal with title, description, priority, due date
- Priority badges: LOW (blue), MEDIUM (yellow), HIGH (red)
- Overdue task detection and visual highlighting
- Completion toggle (checkbox with optimistic update)
- Delete with browser confirmation prompt
- Loading skeleton, empty state, error state with retry on every data fetch
- Sticky glassmorphism navigation header
- Responsive layout (mobile-first)

### Backend / API
- `POST   /api/todos` — Create a task
- `GET    /api/todos?status=all|active|completed` — List tasks with optional filter
- `GET    /api/todos/:id` — Get single task by UUID
- `PATCH  /api/todos/:id` — Partial update (any field subset)
- `DELETE /api/todos/:id` — Delete a task (204 No Content)
- `GET    /health` — Health check endpoint
- Consistent JSON response envelope: `{ success, data }` / `{ success, error: { code, message } }`
- UUID validation on all `:id` params (400 on invalid UUID, 404 on not found)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend Runtime | Node.js v22+ |
| Backend Framework | Express 5 (TypeScript) |
| ORM / DB Access | Prisma 7 (driver adapter pattern) |
| Database | PostgreSQL 16+ |
| Validation | Zod 4 |
| Security | Helmet, CORS, express-rate-limit |
| Frontend Framework | React 19 + TypeScript |
| Frontend Build Tool | Vite 8 (MPA mode) |
| Icons | Lucide React |
| Date Formatting | date-fns |
| Testing | Vitest 5 + Supertest 7 |

---

## Project Structure

```
ziptrrip-assignment/
├── backend/
│   ├── prisma/schema.prisma          # DB schema
│   ├── postman/                      # Postman collection
│   ├── rest-client/todos.http        # VS Code REST Client file
│   ├── src/
│   │   ├── app.ts                    # Express app factory (middleware, routes)
│   │   ├── server.ts                 # HTTP server entrypoint
│   │   ├── config/env.ts             # Environment variable config
│   │   ├── controllers/              # HTTP layer: req/res only
│   │   ├── services/                 # Business logic
│   │   ├── repositories/             # DB access (Prisma calls)
│   │   ├── validators/               # Zod schemas
│   │   ├── middleware/               # validate, errorHandler, notFound
│   │   ├── errors/AppError.ts        # Custom error class
│   │   ├── routes/                   # Express routers
│   │   └── types/                    # Shared TypeScript types
│   └── tests/
│       ├── unit/todo.service.test.ts # 10 unit tests (mocked DB)
│       └── integration/              # 20 integration tests (real DB)
└── frontend/
    ├── todos.html                    # MPA entry point 1: Task list
    ├── todo.html                     # MPA entry point 2: Task detail
    ├── vite.config.ts                # Vite MPA build config
    └── src/
        ├── api/todosClient.ts        # Typed fetch wrapper for all endpoints
        ├── types/todo.ts             # Shared frontend TypeScript types
        ├── components/               # Reusable UI components
        ├── pages/todos/              # TaskFlow list dashboard
        └── pages/todo/               # Task detail page
```

---

## Setup & Running

### Prerequisites
- Node.js v22+
- PostgreSQL v16+ running locally
- npm v11+

### 1. Database Setup

Connect to PostgreSQL and create the two databases (one for the app, one for tests):
```sql
CREATE DATABASE ziptrrip_todos;
CREATE DATABASE ziptrrip_todos_test;
```

### 2. Backend Setup
```bash
cd backend

# Copy and configure environment
cp .env.example .env
# Edit .env if your Postgres credentials differ from the defaults

# Install dependencies and generate Prisma client
npm install
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Start the development server
npm run dev
```
> Server runs at **http://localhost:3000**

### 3. Frontend Setup

Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
> Vite dev server runs at **http://localhost:5173**  
> API calls are automatically proxied to port 3000.

---

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@127.0.0.1:5432/ziptrrip_todos` |
| `PORT` | HTTP server port | `3000` |

> ⚠️ `.env` is git-ignored. Never commit real credentials.

---

## Running Tests

```bash
cd backend
npm test
```

**What is tested (30 tests total):**

| Test File | Count | Coverage |
|---|---|---|
| `tests/unit/todo.service.test.ts` | 10 | `todoService` with a mocked repository — CRUD + 404 cases |
| `tests/integration/todo.routes.test.ts` | 20 | Full API routes against a real test PostgreSQL DB — all endpoints, validation errors, 404s |

A separate `.env.test` is used automatically during tests so the test suite never touches the development database.

---

## API Documentation

See **[API.md](API.md)** for full endpoint documentation including request/response examples.

### Quick Reference

```
GET    /health
POST   /api/todos
GET    /api/todos?status=all|active|completed
GET    /api/todos/:id
PATCH  /api/todos/:id
DELETE /api/todos/:id
```

All responses use a consistent envelope:
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": { "code": "...", "message": "..." } }
```

---

## Using the API Clients

### Postman
1. Open Postman → **Import**
2. Select `backend/postman/ziptrrip-todos.postman_collection.json`
3. The collection has a `baseUrl` variable pre-set to `http://localhost:3000/api/todos`
4. Run requests in order: Create → List → Get → Update → Delete

### VS Code REST Client
1. Install the **REST Client** extension (`humao.rest-client`)
2. Open `backend/rest-client/todos.http`
3. Click **Send Request** above any block

---

## Multi-Page Architecture (MPA) Explained

The frontend is **not** a Single-Page Application. It is a **genuine MPA**:

- **Two separate HTML documents**: `todos.html` and `todo.html`
- **Two separate Vite entry points** (`build.rollupOptions.input` in `vite.config.ts`)
- **Two completely independent React roots** (`ReactDOM.createRoot` in each page's `main.tsx`)
- **No React Router** — navigation between pages uses standard `<a href>` tags
- **Evidence**: Navigate between pages in the browser Network tab → you will see a full `document` request plus a new distinct JS bundle loading on each navigation

See **[ARCHITECTURE.md](ARCHITECTURE.md)** for full details including the MPA network tab evidence.

---

## Documentation

| Document | Contents |
|---|---|
| **[FEATURES.md](FEATURES.md)** | Detailed breakdown of every implemented feature |
| **[API.md](API.md)** | Full API endpoint reference with examples |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Layering rationale and MPA proof |
| **[DECISIONS.md](DECISIONS.md)** | Engineering decisions: why PostgreSQL, Prisma, Zod, MPA |

---

## Known Limitations

- **No authentication** — Not in assignment scope
- **No pagination** — List returns all todos; should be added at scale
- **No Docker** — Local PostgreSQL required; a `docker-compose.yml` is recommended for portability

## Future Improvements

- JWT-based authentication
- Pagination and search on list endpoint
- Docker Compose setup (app + DB in one command)
- Due-date reminder notifications
