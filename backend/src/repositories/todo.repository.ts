import prisma from "../db/prismaClient";
import { CreateTodoInput, UpdateTodoInput, TodoStatus } from "../types/todo.types";
import { Todo } from "@prisma/client";

export const todoRepository = {
  async create(data: CreateTodoInput): Promise<Todo> {
    return prisma.todo.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority ?? "MEDIUM",
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });
  },

  async findMany(status: TodoStatus): Promise<Todo[]> {
    const where =
      status === "active"
        ? { completed: false }
        : status === "completed"
        ? { completed: true }
        : {};

    return prisma.todo.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string): Promise<Todo | null> {
    return prisma.todo.findUnique({ where: { id } });
  },

  async update(id: string, data: UpdateTodoInput): Promise<Todo> {
    return prisma.todo.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.completed !== undefined && { completed: data.completed }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
      },
    });
  },

  async delete(id: string): Promise<void> {
    await prisma.todo.delete({ where: { id } });
  },
};
