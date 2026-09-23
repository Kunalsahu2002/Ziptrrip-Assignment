export type TodoPriority = "LOW" | "MEDIUM" | "HIGH";
export type TodoStatus = "all" | "active" | "completed";

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: TodoPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

