# Architectural & Technical Decisions

## 1. Stack Choices
- **Node.js + Express**: Given the requirement for a Node.js REST API, Express remains the most battle-tested, unopinionated framework for rapidly building a predictable 3-tier architecture.
- **React + Vite (Frontend)**: React is standard. Vite was chosen over Webpack/CRA for its native ES-module dev server, extremely fast HMR, and critical ability to easily configure a multi-page build (`rollupOptions.input`), which was a strict requirement.

## 2. PostgreSQL over MongoDB
The assignment explicitly favored PostgreSQL. A Todo list with strict fields (title, priority enum, boolean status, timestamps) is highly structured relational data. Postgres guarantees data integrity and schema validation at the database level.

## 3. Prisma ORM
Prisma was selected over raw SQL or lightweight query builders (like Knex or Drizzle) because:
- **Type Safety**: It generates a fully typed client directly from the schema, ensuring the `Todo` model is correctly typed across the backend.
- **Speed of Setup**: The migrations system (`prisma migrate`) is very fast to set up for a simple assignment compared to writing raw SQL up/down scripts.
- **Prisma 7 Compatibility**: The project specifically utilizes Prisma 7's new driver adapter (`@prisma/adapter-pg`) to fulfill modern stack expectations.

## 4. Zod Validation at Route Boundaries
Instead of validating data manually or inside the services, `Zod` is used in an Express middleware (`validate.ts`). This guarantees that controllers and services only ever receive clean, validated, correctly-typed data, eliminating defensive programming deep inside the business logic.

## 5. The Multi-Page Application (MPA) Approach
The assignment strictly forbade Single-Page Application (SPA) client-side routing (e.g., React Router).
- **Decision**: Vite was configured to output two separate HTML entry points (`todos.html` and `todo.html`). Each HTML file loads its own React root. 
- **Why**: This perfectly simulates a traditional server-rendered architecture's navigation flow (the browser makes a hard navigation between pages) while still allowing modern React components for the interactive elements (like toggling a todo) *within* the page.

## 6. Omitted Features (Auth & Docker)
- **Authentication**: Omitted to keep the focus strictly on the assignment's explicit core requirements (CRUD, MPA, Testing, DB).
- **Docker**: While Docker is a best practice, setting up a local `pg` instance is sufficient for the assignment scope. Adding Docker would increase the setup time for the evaluator without adding core value to the REST API design.
