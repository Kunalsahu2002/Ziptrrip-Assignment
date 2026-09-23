# API Reference

Base URL: `http://localhost:3000`  
All Todo endpoints are prefixed: `/api/todos`

## Response Envelope

Every response, success or error, uses a consistent JSON envelope:

**Success:**
```json
{ "success": true, "data": { ... } }
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description"
  }
}
```

---

## Endpoints

### Health Check
```
GET /health
```
**Response 200:**
```json
{ "success": true, "data": { "status": "ok" } }
```

---

### Create Todo
```
POST /api/todos
```

**Request body:**
```json
{
  "title": "Build authentication API",
  "description": "Implement JWT and authorization",
  "priority": "HIGH",
  "dueDate": "2026-10-01T00:00:00.000Z"
}
```
- `title` — **required**, string, 1–255 chars
- `description` — optional, string, max 1000 chars
- `priority` — optional, `"LOW"` | `"MEDIUM"` | `"HIGH"` (default: `"MEDIUM"`)
- `dueDate` — optional, ISO 8601 datetime string or `null`

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "78e39723-8fd9-47a8-b3db-c76d4e81240e",
    "title": "Build authentication API",
    "description": "Implement JWT and authorization",
    "completed": false,
    "priority": "HIGH",
    "dueDate": "2026-10-01T00:00:00.000Z",
    "createdAt": "2026-09-22T16:04:31.000Z",
    "updatedAt": "2026-09-22T16:04:31.000Z"
  }
}
```

**Error 400** — Missing or invalid fields:
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "title: Required" } }
```

---

### List Todos
```
GET /api/todos?status=all|active|completed
```
- `status` query param is optional, defaults to `"all"`

**Response 200:**
```json
{ "success": true, "data": [ { ...todo }, { ...todo } ] }
```

---

### Get Single Todo
```
GET /api/todos/:id
```
- `:id` must be a valid UUID

**Response 200:**
```json
{ "success": true, "data": { ...todo } }
```

**Error 400** — Invalid UUID:
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "id: id must be a valid UUID" } }
```

**Error 404** — Not found:
```json
{ "success": false, "error": { "code": "TODO_NOT_FOUND", "message": "Todo with id \"...\" not found" } }
```

---

### Update Todo (Partial)
```
PATCH /api/todos/:id
```

**Request body** — provide any subset of fields:
```json
{
  "completed": true,
  "title": "Renamed task",
  "description": "Updated description",
  "priority": "LOW",
  "dueDate": null
}
```
- At least one field must be provided
- All fields are optional

**Response 200:**
```json
{ "success": true, "data": { ...updatedTodo } }
```

---

### Delete Todo
```
DELETE /api/todos/:id
```

**Response 204:** *(No Content — empty body)*

**Error 404** — Not found: Same envelope as Get Single Todo 404.

---

## HTTP Status Codes Used

| Code | Meaning |
|---|---|
| `200` | OK — successful read or update |
| `201` | Created — todo successfully created |
| `204` | No Content — todo successfully deleted |
| `400` | Bad Request — validation failed |
| `404` | Not Found — todo with given id does not exist |
| `429` | Too Many Requests — rate limit exceeded |
| `500` | Internal Server Error — unexpected server error |
