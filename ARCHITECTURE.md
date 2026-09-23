# Architecture

## Backend Layers

The backend follows a strict 4-layer architecture. Each layer has a single responsibility and depends only on the layer below it.

```
HTTP Request
     |
  [Routes]          — Maps HTTP verbs + paths to controller methods
     |
[Controllers]        — Extracts validated data from req; calls service; writes res
     |
 [Services]          — Business logic (404 checks, computed values, etc.)
     |
[Repositories]       — All database access (Prisma calls)
     |
  [Database]         — PostgreSQL via Prisma ORM
```

### Why this structure?
- **Controllers** never touch the database directly. They only call services and write HTTP responses.
- **Services** have no knowledge of Express (no `req`/`res`). This makes them easy to unit-test in isolation.
- **Repositories** contain all raw Prisma calls, making it straightforward to swap the data layer without touching business logic.

### Validation
All requests are validated by a `validate()` middleware using **Zod schemas** before they reach the controller. If validation fails, the middleware immediately returns a `400` response with a clear error message — controllers and services only ever receive clean, correctly typed data.

### Error Handling
A centralized `errorHandler` middleware sits at the end of the Express chain. All errors propagate via `next(err)`. The handler distinguishes:
- `AppError` (expected domain errors like 404, 400) → returns the error code and message
- Unknown errors → logs server-side, returns a generic `500` message without leaking stack traces

---

## Multi-Page Architecture (MPA) Proof

The assignment explicitly required a genuine MPA — not a React SPA masquerading as multi-page.

### Implementation
- **Two separate HTML documents**: `frontend/todos.html` and `frontend/todo.html`
- **Two separate Vite entry points**: Configured in `vite.config.ts` under `build.rollupOptions.input`
- **Two independent React roots**: Each `pages/*/main.tsx` calls `ReactDOM.createRoot` independently — there is no shared component tree between pages
- **No React Router**: Navigation uses standard `<a href="/todo.html?id=...">` anchor tags
- **Separate JS bundles**: The Vite build outputs distinct bundle files per page (e.g., `todos-[hash].js`, `todo-[hash].js`)

### How to verify
1. Build and preview the production build:
   ```bash
   cd frontend
   npm run build && npm run preview
   ```
2. Open the browser **Network tab** (F12 → Network)
3. Click a task title to navigate to the detail page
4. Observe: a full `document` (HTML) request is made to `/todo.html`, and a **different** JS bundle is downloaded — this is definitive proof of MPA, not SPA
