import { z } from "zod";

const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

// Create todo — title is required
export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be at most 255 characters"),
  description: z.string().max(1000, "Description must be at most 1000 characters").optional(),
  priority: PriorityEnum.optional().default("MEDIUM"),
  dueDate: z
    .string()
    .datetime({ message: "dueDate must be a valid ISO 8601 datetime string" })
    .optional()
    .nullable(),
});

// Update todo — all fields optional
export const updateTodoSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title cannot be empty")
      .max(255, "Title must be at most 255 characters")
      .optional(),
    description: z
      .string()
      .max(1000, "Description must be at most 1000 characters")
      .optional()
      .nullable(),
    completed: z.boolean().optional(),
    priority: PriorityEnum.optional(),
    dueDate: z
      .string()
      .datetime({ message: "dueDate must be a valid ISO 8601 datetime string" })
      .optional()
      .nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// UUID param validation
export const todoIdParamSchema = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});

// Query string validation
export const listQuerySchema = z.object({
  status: z.enum(["all", "active", "completed"]).optional().default("all"),
});

// Inferred TS types
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoIdParam = z.infer<typeof todoIdParamSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
