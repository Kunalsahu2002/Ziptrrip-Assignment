# TaskFlow — Ziptrrip Todo Assignment

> A full-stack Todo application built with **React (genuine MPA) + Node.js/Express + PostgreSQL + TypeScript**.  
> Submitted for the Ziptrrip Backend Engineer technical assignment.

---

## Assignment Requirements & Extra Points

| Requirement / Extra Point | Implementation | Status |
|---|---|---|
| React frontend | React 19 + TypeScript, full component library | ✅ |
| **Genuine MPA** (not SPA) | Two separate HTML entry points (`todos.html`, `todo.html`), no React Router | ✅ |
| Todo list page with features | Dashboard: create, filter, toggle, delete, statistics summary | ✅ |
| Todo detail page receives `id` query param | `todo.html?id=<uuid>` — parses via `URLSearchParams`, fetches and displays that todo | ✅ |
| JS/TypeScript backend server | Node.js + Express 5, 100% TypeScript (strict mode) | ✅ |
| CRUD APIs for todos | POST / GET(list) / GET(:id) / PATCH / DELETE — all 5 endpoints implemented | ✅ |
| Persistent storage | PostgreSQL via Prisma 7 ORM with versioned migrations | ✅ |
| **Unit tests** *(mandatory for backend dev)* | 10 unit tests — `todoService` fully isolated with mocked repository | ✅ |
| **Postman / REST Client** *(mandatory for backend dev)* | Postman collection (10 requests) + VS Code REST Client `.http` file | ✅ |
| **TypeScript** *(extra points)* | 100% TypeScript — backend and frontend, strict compiler flags, `node16` module resolution | ✅ |
| **Database** *(extra points)* | PostgreSQL with Prisma migrations — real relational DB, not file storage | ✅ |
| **Coding organization** *(extra points)* | Strict 4-layer architecture: Routes → Controllers → Services → Repositories | ✅ |
| **Unit tests** *(extra points)* | 30 tests total: 10 unit + 20 integration, all passing | ✅ |
| **Postman / REST Client** *(extra points)* | Both formats provided, covers all endpoints including error cases | ✅ |
| Features documented in `.md` files | `README.md`, `FEATURES.md`, `API.md`, `ARCHITECTURE.md`, `DECISIONS.md` | ✅ |

---

## Engineering Highlights

| Area | Detail |
|---|---|
| **TypeScript** | Strict mode throughout. Backend uses `node16` module resolution + Prisma-generated types. Frontend uses `verbatimModuleSyntax`. Controllers, services, repositories, and all frontend components are fully typed. |
| **PostgreSQL + Prisma 7** | Schema-first ORM with migrations versioned in the repo. Uses Prisma 7's driver adapter pattern (`@prisma/adapter-pg`). Type-safe queries — the `Todo` model type flows from schema → repository → service → controller → response. |
| **4-Layer Architecture** | Routes only map paths. Controllers only handle HTTP. Services only contain business logic. Repositories only contain Prisma calls. Each layer is independently testable. |
| **Zod Validation** | Validated at the route boundary via a `validate()` middleware — before any controller or service runs. Covers: body shape, enum values, string length limits, UUID format, and the "at least one field" rule on PATCH. |
| **Centralized Error Handling** | Custom `AppError` class carries `statusCode` + `code` string. A single `errorHandler` middleware at the end of the Express chain handles all errors uniformly. Stack traces never reach the client. |
| **Security** | `helmet` (secure HTTP headers), `cors` (configurable origin), `express-rate-limit` (100 req/15 min per IP), 10 KB request body limit. |
| **Testing** | Unit tests mock the repository — zero DB required. Integration tests use a dedicated `ziptrrip_todos_test` database, isolated per test via `beforeEach` teardown. 30/30 tests pass. |
| **Genuine MPA** | Two distinct HTML files, two Vite entry points, two separate JS bundles, two independent React roots. Navigation is via native `<a href>` — provable with the browser Network tab on production build. |
| **API Clients** | Postman collection covers all 5 endpoints + 3 error cases (missing title, bad UUID, 404). REST Client `.http` file includes every request with example bodies. |

---

## Project Overview

TaskFlow is a Todo management application that lets users:

- Create tasks with a title, description, priority (Low / Medium / High), and due date
- View all tasks in a dashboard with live statistics (Total, Active, Completed, Overdue)
- Filter tasks by status (All / Active / Completed)
- Toggle tasks complete/incomplete with real-time optimistic updates
- Delete tasks with a confirmation prompt
- Navigate to a full task detail page to see all metadata and timestamps
- Interact with a clean, validated REST API backed by PostgreSQL

---

## Features

### Frontend — Todo List Page (`/todos.html`)

The main dashboard for managing all tasks.

- **Statistics Summary**: Four dynamically-computed cards — Total, Active, Completed, and Overdue tasks, each with a color-coded icon.
- **Create Task Modal**: A clean centered modal with fields for Title (required), Description, Priority (Low / Medium / High), and Due Date. Opens via the "+ Add Task" button.
- **Task Cards**: Each card shows:
  - Custom styled checkbox (click to toggle completion)
  - Task title as a native `<a href>` link to the detail page
  - Description snippet (2-line truncated)
  - Color-coded priority badge: LOW (blue), MEDIUM (yellow), HIGH (red)
  - Due date badge — turns red when overdue
  - Three-dot menu with "View / Edit" and "Delete" actions
  - Subtle hover lift animation
  - Strikethrough + muted opacity when completed
- **Status Filter Tabs**: "All Tasks", "Active", "Completed" — tab-style filter bar with active state indicator
- **Empty State**: A friendly illustration shown when no tasks match the current filter
- **Loading Skeleton**: Shimmering skeleton loaders during every data fetch
- **Error State**: A centered error card with a Retry button if the API call fails
- **Optimistic Updates**: Checkbox toggle updates UI immediately before the API response

### Frontend — Todo Detail Page (`/todo.html?id=<uuid>`)

A focused view for a specific task, accessed from the list via a standard HTML link.

- **Query Parameter Parsing**: Reads `id` from `window.location.search` using `URLSearchParams` — no framework routing
- **Error Handling**: Shows a clear inline error for missing ID, malformed ID, or 404 from the API — never crashes
- **Detail Display**:
  - Large bold task title (with strikethrough if completed)
  - Full description
  - Priority badge (color-coded)
  - Completion status badge (Active / Completed)
  - Two-column metadata grid: Status, Priority, Category, Due Date, Created At, Last Updated
- **Footer Actions**: Mark Complete / Mark Active toggle, Delete button
- **Back Navigation**: Standard `<a href="/todos.html">← Back to Tasks</a>` — a genuine page reload, not JS navigation

### Frontend — MPA Architecture & Shared UI

- **True Multi-Page Application**: No React Router. Two separate HTML files with separate React roots.
- **Shared Component Library**: `Button`, `Badge`, `Modal`, `Header`, `LoadingState`, `ErrorState`, `FilterBar`, `TodoForm`, `TodoListItem`
- **Sticky Header**: Glassmorphism navigation header with the "TaskFlow" logo, tagline, and user avatar
- **Responsive Layout**: Dashboard statistics stack on mobile; task cards adapt to narrow screens
- **Inter Typography**: Loaded via Google Fonts for crisp, professional type rendering
- **CSS Design System**: CSS custom properties define the full color palette, shadows, border radii, and spacing scale

---

## Backend Architecture

The backend follows a strict 4-layer architecture. Each layer has one responsibility and no knowledge of the layer above it.

```
HTTP Request
     │
  [Routes]        → maps HTTP verbs + paths to controller methods
     │
[Controllers]     → extracts validated data from req; calls service; writes res
     │
 [Services]       → business logic only (no req/res, no Prisma)
     │
[Repositories]    → all Prisma/DB calls, nothing else
     │
  [PostgreSQL]
```

**Why this matters:**
- Services are tested in isolation without a database (unit tests mock the repository)
- Repositories can be swapped without touching business logic
- Controllers stay thin — they never contain conditionals or data transformations

### Validation — Zod at Route Boundaries

A `validate(schema, target)` middleware runs Zod validation **before** the controller. If the payload is invalid, the middleware immediately returns `400` with a structured error message — the controller and service never execute.

Validated targets per endpoint:

| Endpoint | Validated |
|---|---|
| `POST /api/todos` | Body: title required, description length, priority enum, dueDate ISO format |
| `GET /api/todos` | Query: status enum (`all` / `active` / `completed`) |
| `GET /api/todos/:id` | Params: UUID format |
| `PATCH /api/todos/:id` | Params: UUID; Body: any subset of fields, at least one required |
| `DELETE /api/todos/:id` | Params: UUID format |

### Error Handling

All errors flow via `next(err)` to a single `errorHandler` middleware:

```typescript
// Expected errors (domain logic)
throw new AppError("Todo not found", 404, "TODO_NOT_FOUND");

// Response:
{ "success": false, "error": { "code": "TODO_NOT_FOUND", "message": "Todo not found" } }
```

Unexpected errors are logged server-side and return a generic `500` — no stack traces are ever sent to the client.

### Security Measures

| Measure | Implementation |
|---|---|
| Secure HTTP headers | `helmet` middleware — sets CSP, HSTS, X-Content-Type-Options, etc. |
| CORS | `cors` middleware — origin configurable via `CORS_ORIGIN` env var |
| Rate limiting | `express-rate-limit` — 100 requests per 15 minutes per IP on `/api/*` |
| Body size limit | Express `json({ limit: "10kb" })` — prevents payload flooding |
| UUID validation | All `:id` params validated as UUID before reaching the service layer |

---

## CRUD API Reference

Base URL: `http://localhost:3000`

All endpoints return a consistent JSON envelope:
```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": { "code": "...", "message": "..." } }
```

| Method | Path | Description | Success Code |
|---|---|---|---|
| `GET` | `/health` | Server health check | `200` |
| `POST` | `/api/todos` | Create a new task | `201` |
| `GET` | `/api/todos` | List tasks (`?status=all\|active\|completed`) | `200` |
| `GET` | `/api/todos/:id` | Get a single task by UUID | `200` |
| `PATCH` | `/api/todos/:id` | Partial update (any field subset) | `200` |
| `DELETE` | `/api/todos/:id` | Delete a task | `204` |

**Example — Create Task:**
```bash
POST /api/todos
Content-Type: application/json

{
  "title": "Build authentication API",
  "description": "Implement JWT and authorization",
  "priority": "HIGH",
  "dueDate": "2026-10-01T00:00:00.000Z"
}
```

**Example — 400 Validation Error:**
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "title: Required" } }
```

**Example — 404 Not Found:**
```json
{ "success": false, "error": { "code": "TODO_NOT_FOUND", "message": "Todo with id \"...\" not found" } }
```

For complete request/response examples for every endpoint, see **[API.md](API.md)**.

---

## Database & Persistence

**PostgreSQL** is used as the primary data store — a real relational database, not file storage.

**Why PostgreSQL over MongoDB:**
- Todo data is highly structured (fixed fields, enum priorities, boolean status, timestamps)
- Postgres enforces schema-level data integrity — malformed data cannot enter the database
- Relational databases suit the filtering requirements (active/completed queries map cleanly to `WHERE` clauses)

**Why Prisma over raw SQL / Knex / Drizzle:**
- Generates a fully typed client from the schema — the `Todo` TypeScript type is always in sync with the database
- The migration system (`prisma migrate`) handles schema versioning without writing raw SQL up/down scripts
- Prisma 7's driver adapter pattern (`@prisma/adapter-pg`) keeps the project on the current release

**Schema:**
```prisma
model Todo {
  id          String    @id @default(uuid())
  title       String
  description String?
  completed   Boolean   @default(false)
  priority    Priority  @default(MEDIUM)
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Priority { LOW  MEDIUM  HIGH }
```

---

## TypeScript Usage

TypeScript is used throughout the entire stack — not just for type annotations, but as a structural discipline:

- **Backend**: Strict mode (`strict: true`), `node16` module resolution. Prisma generates types from the schema, which flow from the repository all the way to the JSON response shape.
- **Frontend**: `verbatimModuleSyntax` enforced. All component props, API responses, and state shapes are typed. The `todosClient.ts` API wrapper uses generics to return fully typed data.
- **Shared discipline**: Controllers accept typed validated inputs. Services return typed domain objects. There are no `any` types in the source code.

---

## Genuine Multi-Page Architecture (MPA)

The assignment required a genuine MPA — not a React SPA masquerading as multi-page.

### How it works

```
frontend/
├── todos.html  ← Entry point 1: loads src/pages/todos/main.tsx
└── todo.html   ← Entry point 2: loads src/pages/todo/main.tsx
```

- **No React Router** is installed
- Each HTML file has its own `<script type="module">` tag
- Each `main.tsx` calls `ReactDOM.createRoot` independently — there is no shared React tree
- `vite.config.ts` defines both as `build.rollupOptions.input` entries, producing **two separate JS bundles**
- Navigation between pages uses `<a href="/todo.html?id=...">` — a real browser navigation

**Why Vite over Next.js or Webpack for MPA:**
- Vite's `rollupOptions.input` makes multi-page builds trivial (two lines of config)
- No server-side rendering needed — the backend is already a separate Express server
- Avoids the complexity of a Next.js framework for what is fundamentally a static client-side app with an external API

### How to verify it's genuinely MPA

1. `cd frontend && npm run build && npm run preview`
2. Open the browser **Network tab** (F12 → Network → filter by "Doc")
3. Click any task title to navigate to the detail page
4. **Observe**: a full `document` (HTML) request loads for `todo.html`, and a **different** JS bundle (`todo-[hash].js`) downloads — distinct from `todos-[hash].js` used on the list page

---

## Testing

### Run the tests
```bash
cd backend
npm test
```

### What is tested (30 tests, all passing)

| File | Tests | What it covers |
|---|---|---|
| `tests/unit/todo.service.test.ts` | 10 | `todoService` with mocked repository — create, list (all/active/completed), getById (found + 404), update (found + 404), delete (found + 404) |
| `tests/integration/todo.routes.test.ts` | 20 | Full HTTP requests via Supertest against a real PostgreSQL test DB — all endpoints, validation errors (400), not-found (404), default values, filtering |

**Test isolation:** The integration tests use a dedicated `ziptrrip_todos_test` database (configured in `backend/.env.test`) and run `prisma.todo.deleteMany()` before each test — the development database is never touched.

**Unit test approach:** The repository layer is fully mocked using `vi.mock()`. This means unit tests run with zero database dependency and complete in milliseconds.

---

## API Clients

Two formats are provided for evaluators to test the API directly.

### Postman Collection
- **File:** `backend/postman/ziptrrip-todos.postman_collection.json`
- **Requests:** 10 (all CRUD endpoints + error cases: missing title, invalid UUID, 404)
- **Usage:** Postman → Import → select the file → `baseUrl` is pre-configured

### VS Code REST Client
- **File:** `backend/rest-client/todos.http`
- **Usage:** Install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension → open the file → click "Send Request"
- **Includes:** Health check, create (full + minimal), list (all/active/completed), get by ID, update, delete, error cases

---

## Key Technical Decisions

### 1. Node.js + Express 5
Express is battle-tested and unopinionated, making it ideal for demonstrating clean architectural layering without framework magic obscuring the design. Express 5 is used for its improved async error propagation (no need to wrap every handler in try/catch for unhandled promise rejections).

### 2. PostgreSQL over MongoDB
Todo data has a fixed, well-defined schema. Relational integrity (enum enforcement, NOT NULL constraints) guarantees correctness at the database level. The `status` filter (`active` / `completed`) maps directly to simple `WHERE completed = false` queries — exactly what relational DBs are built for.

### 3. Prisma over raw SQL or Drizzle
Prisma's schema-first approach generates a typed client that eliminates an entire class of runtime bugs (wrong field names, mismatched types). The migration system provides a clear, versioned history of schema changes with no boilerplate. Prisma 7's driver adapter pattern was used to stay on the current major version.

### 4. Zod for validation at route boundaries
Validation happens in middleware, before controllers run. This keeps controllers and services free of defensive checks (`if (!body.title)...`). Zod's error messages are structured and specific, making 400 responses informative for API consumers.

### 5. Vite MPA over Next.js
The assignment required a static React frontend talking to a separate Express backend. Next.js would add SSR complexity, a file-system router, and API routes that conflict with the assignment's own backend requirement. Vite's `rollupOptions.input` achieves the MPA requirement in two lines of config with no framework overhead.

### 6. Authentication omitted
Authentication is not mentioned in the assignment requirements. Adding JWT auth would increase setup complexity for evaluators and shift focus away from the core engineering areas being assessed: REST API design, database usage, testing, and MPA architecture.

### 7. Docker omitted
A local PostgreSQL installation is sufficient for evaluation. Introducing Docker Compose would add steps to the setup without demonstrating additional backend engineering skill. It is noted as a future improvement.

---

## Project Structure

```
ziptrrip-assignment/
├── README.md                          ← You are here
├── FEATURES.md                        ← Full feature breakdown
├── API.md                             ← Complete API reference
├── ARCHITECTURE.md                    ← Architecture diagram + MPA proof
├── DECISIONS.md                       ← Engineering decision rationale
│
├── backend/
│   ├── .env.example                   ← Environment variable template
│   ├── .env.test                      ← Test database config (committed intentionally)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── prisma7.config.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma              ← Database schema (source of truth)
│   │   └── migrations/                ← Versioned migration history
│   │
│   ├── postman/
│   │   └── ziptrrip-todos.postman_collection.json
│   ├── rest-client/
│   │   └── todos.http
│   │
│   ├── src/
│   │   ├── app.ts                     ← Express factory: middleware, routes
│   │   ├── server.ts                  ← HTTP server entrypoint
│   │   ├── config/env.ts              ← Typed environment variables
│   │   ├── routes/todo.routes.ts      ← Route definitions only
│   │   ├── controllers/               ← HTTP layer (req/res)
│   │   ├── services/                  ← Business logic
│   │   ├── repositories/              ← Database access (Prisma)
│   │   ├── validators/todo.schema.ts  ← Zod schemas
│   │   ├── middleware/                ← validate, errorHandler, notFound
│   │   ├── errors/AppError.ts         ← Custom error class
│   │   └── types/                     ← Shared TypeScript types
│   │
│   └── tests/
│       ├── unit/todo.service.test.ts  ← 10 unit tests (no DB)
│       ├── integration/               ← 20 integration tests (real DB)
│       └── setup.ts
│
└── frontend/
    ├── todos.html                     ← MPA entry point 1: Task list
    ├── todo.html                      ← MPA entry point 2: Task detail
    ├── vite.config.ts                 ← MPA build config
    ├── package.json
    │
    └── src/
        ├── api/todosClient.ts         ← Typed fetch wrapper for all endpoints
        ├── types/todo.ts              ← Shared frontend TypeScript types
        ├── index.css                  ← Global CSS design system (custom properties)
        ├── components/                ← Badge, Button, Modal, Header, FilterBar, etc.
        └── pages/
            ├── todos/                 ← Dashboard (TodosPage.tsx + main.tsx)
            └── todo/                  ← Detail view (TodoPage.tsx + main.tsx)
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Backend Runtime | Node.js | v22+ |
| Backend Framework | Express | 5 |
| Language | TypeScript | 7 (strict) |
| ORM | Prisma | 7 |
| Database | PostgreSQL | 16+ |
| Validation | Zod | 4 |
| Security | Helmet, CORS, express-rate-limit | latest |
| Frontend Framework | React | 19 |
| Frontend Build | Vite | 8 (MPA mode) |
| Icons | Lucide React | latest |
| Date Formatting | date-fns | latest |
| Testing | Vitest + Supertest | 5 / 7 |

---

## Setup & Running

### Prerequisites
- Node.js v22+
- PostgreSQL v16+ running locally
- npm v11+

### 1. Create Databases

Connect to PostgreSQL and run:
```sql
CREATE DATABASE ziptrrip_todos;
CREATE DATABASE ziptrrip_todos_test;
```

### 2. Backend Setup
```bash
cd backend

# Copy environment template and configure
cp .env.example .env
# Edit .env if your Postgres user/password differs from the default (postgres:postgres)

# Install dependencies
npm install

# Generate Prisma client from schema
npx prisma generate

# Apply migrations to create the todos table
npx prisma migrate deploy

# Start the development server (http://localhost:3000)
npm run dev
```

### 3. Frontend Setup

Open a second terminal:
```bash
cd frontend
npm install

# Start Vite dev server (http://localhost:5173)
# API calls to /api/* are automatically proxied to port 3000
npm run dev
```

**Open the app:**
- List page: `http://localhost:5173/todos.html`
- Detail page: navigate from the list by clicking any task title

---

## Environment Variables

`backend/.env` (create from `backend/.env.example`):

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@127.0.0.1:5432/ziptrrip_todos` |
| `PORT` | HTTP server port | `3000` |
| `CORS_ORIGIN` | Allowed CORS origin (optional) | `*` |

> `.env` is git-ignored and must never be committed. `.env.example` contains safe default values.

---

## Known Limitations & Future Improvements

| Limitation | Reason | Suggested Fix |
|---|---|---|
| No authentication | Outside assignment scope | Add JWT middleware (Passport.js or custom) |
| No pagination | Not required at assignment scale | Add `limit`/`offset` or cursor pagination to the list endpoint |
| No Docker | Not required; adds evaluator setup burden | Add `docker-compose.yml` with PostgreSQL + backend + frontend |
| No tag/category storage | UI shows "General" as a placeholder | Add a `category` field to the Prisma schema |

---

*For detailed API examples, see [API.md](API.md). For architecture diagrams and MPA network-tab proof, see [ARCHITECTURE.md](ARCHITECTURE.md).*
