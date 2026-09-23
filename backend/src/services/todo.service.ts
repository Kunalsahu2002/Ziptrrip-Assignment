import { todoRepository } from "../repositories/todo.repository";
import { AppError } from "../errors/AppError";
import { CreateTodoInput, UpdateTodoInput, TodoStatus } from "../types/todo.types";
import { Todo } from "@prisma/client";

export const todoService = {
  async create(data: CreateTodoInput): Promise<Todo> {
    return todoRepository.create(data);
  },

  async list(status: TodoStatus): Promise<Todo[]> {
    return todoRepository.findMany(status);
  },

  async getById(id: string): Promise<Todo> {
    const todo = await todoRepository.findById(id);
    if (!todo) {
      throw new AppError(`Todo with id "${id}" not found`, 404, "TODO_NOT_FOUND");
    }
    return todo;
  },

  async update(id: string, data: UpdateTodoInput): Promise<Todo> {
    // Verify existence before update
    await todoService.getById(id);
    return todoRepository.update(id, data);
  },

  async delete(id: string): Promise<void> {
    // Verify existence before delete
    await todoService.getById(id);
    await todoRepository.delete(id);
  },
};
