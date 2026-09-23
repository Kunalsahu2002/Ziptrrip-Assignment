import { Request, Response, NextFunction } from "express";
import { todoService } from "../services/todo.service";
import { CreateTodoInput, UpdateTodoInput, TodoStatus } from "../types/todo.types";

export const todoController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.validatedBody as unknown as CreateTodoInput;
      const todo = await todoService.create(body);
      res.status(201).json({ success: true, data: todo });
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.validatedQuery as unknown as { status: TodoStatus } | undefined;
      const status: TodoStatus = query?.status ?? "all";
      const todos = await todoService.list(status);
      res.status(200).json({ success: true, data: todos });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.validatedParams as unknown as { id: string };
      const todo = await todoService.getById(params.id);
      res.status(200).json({ success: true, data: todo });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.validatedParams as unknown as { id: string };
      const body = req.validatedBody as unknown as UpdateTodoInput;
      const todo = await todoService.update(params.id, body);
      res.status(200).json({ success: true, data: todo });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = req.validatedParams as unknown as { id: string };
      await todoService.delete(params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
