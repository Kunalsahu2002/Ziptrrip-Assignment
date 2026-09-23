import { describe, it, expect, vi, beforeEach } from "vitest";
import { todoService } from "../../src/services/todo.service";
import { todoRepository } from "../../src/repositories/todo.repository";
import { AppError } from "../../src/errors/AppError";

// Mock the entire repository module
vi.mock("../../src/repositories/todo.repository", () => ({
  todoRepository: {
    create: vi.fn(),
    findMany: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockTodo = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  title: "Test Todo",
  description: "A test description",
  completed: false,
  priority: "MEDIUM" as const,
  dueDate: null,
  createdAt: new Date("2026-09-22T00:00:00Z"),
  updatedAt: new Date("2026-09-22T00:00:00Z"),
};

describe("todoService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a todo and return it", async () => {
      vi.mocked(todoRepository.create).mockResolvedValue(mockTodo);

      const result = await todoService.create({ title: "Test Todo" });

      expect(todoRepository.create).toHaveBeenCalledWith({ title: "Test Todo" });
      expect(result).toEqual(mockTodo);
    });
  });

  describe("list", () => {
    it("should return all todos when status is all", async () => {
      vi.mocked(todoRepository.findMany).mockResolvedValue([mockTodo]);

      const result = await todoService.list("all");

      expect(todoRepository.findMany).toHaveBeenCalledWith("all");
      expect(result).toEqual([mockTodo]);
    });

    it("should filter active todos when status is active", async () => {
      vi.mocked(todoRepository.findMany).mockResolvedValue([]);

      await todoService.list("active");

      expect(todoRepository.findMany).toHaveBeenCalledWith("active");
    });

    it("should filter completed todos when status is completed", async () => {
      vi.mocked(todoRepository.findMany).mockResolvedValue([{ ...mockTodo, completed: true }]);

      const result = await todoService.list("completed");

      expect(todoRepository.findMany).toHaveBeenCalledWith("completed");
      expect(result[0]?.completed).toBe(true);
    });
  });

  describe("getById", () => {
    it("should return the todo when it exists", async () => {
      vi.mocked(todoRepository.findById).mockResolvedValue(mockTodo);

      const result = await todoService.getById(mockTodo.id);

      expect(todoRepository.findById).toHaveBeenCalledWith(mockTodo.id);
      expect(result).toEqual(mockTodo);
    });

    it("should throw AppError with 404 when todo does not exist", async () => {
      vi.mocked(todoRepository.findById).mockResolvedValue(null);

      await expect(todoService.getById("non-existent-id")).rejects.toThrow(AppError);
      await expect(todoService.getById("non-existent-id")).rejects.toMatchObject({
        statusCode: 404,
        code: "TODO_NOT_FOUND",
      });
    });
  });

  describe("update", () => {
    it("should update and return the todo when it exists", async () => {
      const updatedTodo = { ...mockTodo, title: "Updated Title", completed: true };
      vi.mocked(todoRepository.findById).mockResolvedValue(mockTodo);
      vi.mocked(todoRepository.update).mockResolvedValue(updatedTodo);

      const result = await todoService.update(mockTodo.id, { title: "Updated Title", completed: true });

      expect(todoRepository.update).toHaveBeenCalledWith(mockTodo.id, {
        title: "Updated Title",
        completed: true,
      });
      expect(result.title).toBe("Updated Title");
    });

    it("should throw AppError with 404 when todo does not exist", async () => {
      vi.mocked(todoRepository.findById).mockResolvedValue(null);

      await expect(
        todoService.update("non-existent-id", { title: "Update" })
      ).rejects.toMatchObject({ statusCode: 404, code: "TODO_NOT_FOUND" });
    });
  });

  describe("delete", () => {
    it("should delete the todo when it exists", async () => {
      vi.mocked(todoRepository.findById).mockResolvedValue(mockTodo);
      vi.mocked(todoRepository.delete).mockResolvedValue(undefined);

      await todoService.delete(mockTodo.id);

      expect(todoRepository.delete).toHaveBeenCalledWith(mockTodo.id);
    });

    it("should throw AppError with 404 when todo does not exist", async () => {
      vi.mocked(todoRepository.findById).mockResolvedValue(null);

      await expect(todoService.delete("non-existent-id")).rejects.toMatchObject({
        statusCode: 404,
        code: "TODO_NOT_FOUND",
      });
      expect(todoRepository.delete).not.toHaveBeenCalled();
    });
  });
});
