import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app";
import prisma from "../../src/db/prismaClient";

// Clean up test database before each test
beforeEach(async () => {
  await prisma.todo.deleteMany();
});

afterAll(async () => {
  await prisma.todo.deleteMany();
  await prisma.$disconnect();
});

describe("Todo Routes Integration Tests", () => {
  describe("POST /api/todos", () => {
    it("should create a todo and return 201 with correct shape", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({
          title: "Buy groceries",
          description: "Milk and bread",
          priority: "HIGH",
          dueDate: "2026-10-01T00:00:00.000Z",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        title: "Buy groceries",
        description: "Milk and bread",
        priority: "HIGH",
        completed: false,
      });
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.createdAt).toBeDefined();
      expect(res.body.data.updatedAt).toBeDefined();
    });

    it("should return 400 when title is missing", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({ description: "No title" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 400 when priority is invalid", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({ title: "Test", priority: "CRITICAL" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should use MEDIUM as default priority", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({ title: "Default priority todo" });

      expect(res.status).toBe(201);
      expect(res.body.data.priority).toBe("MEDIUM");
    });
  });

  describe("GET /api/todos", () => {
    it("should return empty list when no todos exist", async () => {
      const res = await request(app).get("/api/todos");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it("should return all todos", async () => {
      await request(app).post("/api/todos").send({ title: "Todo 1" });
      await request(app).post("/api/todos").send({ title: "Todo 2" });

      const res = await request(app).get("/api/todos");

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });

    it("should filter active todos", async () => {
      const r1 = await request(app).post("/api/todos").send({ title: "Active" });
      const r2 = await request(app).post("/api/todos").send({ title: "Completed" });
      await request(app)
        .patch(`/api/todos/${r2.body.data.id}`)
        .send({ completed: true });

      const res = await request(app).get("/api/todos?status=active");

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe("Active");
    });

    it("should filter completed todos", async () => {
      const r1 = await request(app).post("/api/todos").send({ title: "Active" });
      const r2 = await request(app).post("/api/todos").send({ title: "Completed" });
      await request(app)
        .patch(`/api/todos/${r2.body.data.id}`)
        .send({ completed: true });

      const res = await request(app).get("/api/todos?status=completed");

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].completed).toBe(true);
    });

    it("should return 400 on invalid status query", async () => {
      const res = await request(app).get("/api/todos?status=invalid");

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /api/todos/:id", () => {
    it("should return a single todo by id", async () => {
      const create = await request(app)
        .post("/api/todos")
        .send({ title: "Find me" });
      const id = create.body.data.id;

      const res = await request(app).get(`/api/todos/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(id);
      expect(res.body.data.title).toBe("Find me");
    });

    it("should return 404 when todo does not exist", async () => {
      const res = await request(app).get(
        "/api/todos/00000000-0000-0000-0000-000000000000"
      );

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("TODO_NOT_FOUND");
    });

    it("should return 400 when id is not a valid UUID (malformed)", async () => {
      const res = await request(app).get("/api/todos/not-a-uuid");

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("PATCH /api/todos/:id", () => {
    it("should update a todo and return 200", async () => {
      const create = await request(app)
        .post("/api/todos")
        .send({ title: "Original title" });
      const id = create.body.data.id;

      const res = await request(app)
        .patch(`/api/todos/${id}`)
        .send({ title: "Updated title", completed: true });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Updated title");
      expect(res.body.data.completed).toBe(true);
    });

    it("should return 404 when updating a non-existent todo", async () => {
      const res = await request(app)
        .patch("/api/todos/00000000-0000-0000-0000-000000000000")
        .send({ title: "Will not update" });

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("TODO_NOT_FOUND");
    });

    it("should return 400 when id is malformed", async () => {
      const res = await request(app)
        .patch("/api/todos/bad-uuid")
        .send({ title: "Test" });

      expect(res.status).toBe(400);
    });

    it("should return 400 when update body is invalid", async () => {
      const create = await request(app)
        .post("/api/todos")
        .send({ title: "Test" });
      const id = create.body.data.id;

      const res = await request(app)
        .patch(`/api/todos/${id}`)
        .send({ priority: "INVALID_PRIORITY" });

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("should delete a todo and return 204", async () => {
      const create = await request(app)
        .post("/api/todos")
        .send({ title: "Delete me" });
      const id = create.body.data.id;

      const res = await request(app).delete(`/api/todos/${id}`);

      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });

    it("should return 404 when getting a deleted todo", async () => {
      const create = await request(app)
        .post("/api/todos")
        .send({ title: "Delete and verify" });
      const id = create.body.data.id;

      await request(app).delete(`/api/todos/${id}`);
      const res = await request(app).get(`/api/todos/${id}`);

      expect(res.status).toBe(404);
    });

    it("should return 404 when deleting a non-existent todo", async () => {
      const res = await request(app).delete(
        "/api/todos/00000000-0000-0000-0000-000000000000"
      );

      expect(res.status).toBe(404);
    });

    it("should return 400 when id is malformed", async () => {
      const res = await request(app).delete("/api/todos/not-valid-uuid");

      expect(res.status).toBe(400);
    });
  });
});
