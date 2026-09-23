# TaskFlow Frontend

React + TypeScript + Vite multi-page application.

## Pages

| URL | Entry Point | Description |
|---|---|---|
| `/todos.html` | `src/pages/todos/main.tsx` | Task list dashboard |
| `/todo.html?id=<uuid>` | `src/pages/todo/main.tsx` | Task detail view |

## Running

```bash
npm install
npm run dev        # Dev server on http://localhost:5173
npm run build      # Production build (two HTML bundles output to dist/)
npm run preview    # Preview production build locally
```

> The dev server proxies `/api/*` requests to `http://localhost:3000` (the backend).

## Structure

```
src/
├── api/           # Typed fetch wrapper (todosClient.ts)
├── components/    # Shared UI components (Badge, Button, Modal, Header, etc.)
├── pages/
│   ├── todos/     # Task list page (TodosPage.tsx + main.tsx)
│   └── todo/      # Task detail page (TodoPage.tsx + main.tsx)
└── types/         # Shared TypeScript types
```

See the root [README.md](../README.md) for full project documentation.
