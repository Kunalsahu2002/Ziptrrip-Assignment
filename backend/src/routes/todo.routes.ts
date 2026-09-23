import { Router } from "express";
import { todoController } from "../controllers/todo.controller";
import { validate } from "../middleware/validate";
import {
  createTodoSchema,
  updateTodoSchema,
  todoIdParamSchema,
  listQuerySchema,
} from "../validators/todo.schema";

const router = Router();

// POST /api/todos — Create a new todo
router.post("/", validate(createTodoSchema, "body"), todoController.create);

// GET /api/todos?status=all|active|completed — List todos
router.get("/", validate(listQuerySchema, "query"), todoController.list);

// GET /api/todos/:id — Get single todo by id
router.get("/:id", validate(todoIdParamSchema, "params"), todoController.getById);

// PATCH /api/todos/:id — Partial update of a todo
router.patch(
  "/:id",
  validate(todoIdParamSchema, "params"),
  validate(updateTodoSchema, "body"),
  todoController.update
);

// DELETE /api/todos/:id — Delete a todo
router.delete("/:id", validate(todoIdParamSchema, "params"), todoController.delete);

export default router;
