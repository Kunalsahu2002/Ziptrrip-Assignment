# Features and Functionalities

This document explicitly details every feature and functionality implemented in the Ziptrrip Todo Application, directly addressing the assignment requirements.

## 1. Frontend Architecture & Pages
- **True Multi-Page Application (MPA)**: The frontend is built using React and Vite but intentionally avoids Single-Page Application (SPA) routing (no React Router).
  - Navigation between the List page and the Detail page triggers a **full document request** to the server.
  - The application uses two completely separate HTML entry points (`todos.html` and `todo.html`).
  - Separate JavaScript bundles are generated and loaded for each page.
- **TypeScript Support**: The entire frontend is strongly typed using TypeScript for all components and API interactions.
- **Global UI States**: Every API interaction features a visual **Loading state**, **Empty state** (when no todos exist), and an **Error state** with a retry mechanism.

## 2. Todos List Page (`/todos.html`)
The main dashboard for managing tasks.
- **Create Todo**: A comprehensive form to add new tasks. Supports setting a `Title` (required), `Description`, `Priority` (Low, Medium, High), and `Due Date`.
- **List Display**: Renders a list of all tasks. 
  - Each item displays its title, description snippet, priority badge (color-coded), due date, and completion status.
  - The title acts as a native HTML link (`<a href>`) to the Todo Detail page.
- **Status Filtering**: A filter bar allows the user to instantly view `All`, `Active`, or `Completed` tasks.
- **Toggle Completion**: A checkbox on each list item allows one-click toggling of the completion status, updating the database in real-time.
- **Delete Todo**: A dedicated delete button for each task with a browser confirmation prompt to prevent accidental deletion.

## 3. Single Todo Detail Page (`/todo.html?id=...`)
A focused view for a specific task.
- **Query Parameter Parsing**: The page reads the `id` from the URL query string (`window.location.search`) on load.
- **Detail Display**: Fetches and renders all data associated with the task, including:
  - Title (rendered with a strikethrough if completed)
  - Full Description
  - Priority Level (highlighted badge)
  - Completion Status (Active/Completed badge)
  - Due Date
  - System Timestamps (`CreatedAt` and `UpdatedAt`)
- **Error Handling**: Gracefully handles malformed IDs, missing IDs, or non-existent IDs (404) with clear error messages.
- **Navigation**: Includes a standard HTML link (`<a href="/todos.html">`) to return to the list page via a full page reload.

## 4. Backend Server & Architecture
- **Tech Stack**: Node.js, Express, and TypeScript.
- **Layered Organization**: Code is strictly organized into `routes`, `controllers` (HTTP layer), `services` (business logic), and `repositories` (database layer) to ensure high maintainability and testability.
- **Request Validation**: All incoming requests are strictly validated using **Zod** middleware. Invalid payloads are rejected with detailed 400 Bad Request error messages before hitting the business logic.
- **Security Middleware**: Configured with `helmet` for HTTP headers, `cors` for cross-origin requests, and `express-rate-limit` to prevent abuse.

## 5. CRUD RESTful APIs
The backend exposes a fully functional, standard REST API at `/api/todos`:
- `POST /api/todos`: Create a new todo.
- `GET /api/todos`: Retrieve all todos (supports `?status=all|active|completed` query filtering).
- `GET /api/todos/:id`: Retrieve a single todo by its UUID.
- `PATCH /api/todos/:id`: Partially update a todo (e.g., mark as complete, change title).
- `DELETE /api/todos/:id`: Delete a todo.

## 6. Database & Persistence
- **PostgreSQL**: Used as the primary data store, satisfying the "extra points" requirement for a real database.
- **Prisma ORM**: Utilized to manage the database schema, perform migrations, and guarantee type-safety between the database and the TypeScript server.

## 7. Testing & Quality Assurance
- **Unit & Integration Tests**: Written using **Vitest**.
  - Includes isolated unit tests for the `TodoService` using mocked repositories.
  - Includes end-to-end integration tests using `Supertest` that run against a dedicated `ziptrrip_todos_test` database to verify full API functionality.
- **Test Coverage**: 30 passing tests ensuring complete coverage of successful operations and edge-case error handling (e.g., 404s, malformed UUIDs).

## 8. API Clients
To facilitate easy testing for evaluators, two formats of API clients are provided in the repository:
- **Postman Collection**: `backend/postman/ziptrrip-todos.postman_collection.json` (Includes environment variables and automated test assertions for every endpoint).
- **REST Client File**: `backend/rest-client/todos.http` (For use with the VS Code REST Client extension).
