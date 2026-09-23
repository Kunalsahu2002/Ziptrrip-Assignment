import type { Todo, TodoStatus, ApiResponse } from "../types/todo";

const BASE_URL = "/api/todos";

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const json: ApiResponse<T> = await response.json();
  
  if (!response.ok || !json.success) {
    throw new Error(json.error?.message || "An unexpected error occurred");
  }
  
  return json.data;
}

export const todosClient = {
  list: (status: TodoStatus = "all") => 
    fetchApi<Todo[]>(`${BASE_URL}?status=${status}`),
    
  get: (id: string) => 
    fetchApi<Todo>(`${BASE_URL}/${id}`),
    
  create: (data: { title: string; description?: string; priority?: string; dueDate?: string | null }) => 
    fetchApi<Todo>(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    
  update: (id: string, data: Partial<Todo>) => 
    fetchApi<Todo>(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      let message = "Failed to delete";
      try {
        const json = await response.json();
        if (json.error?.message) message = json.error.message;
      } catch (e) {
        // ignore JSON parse error on 204
      }
      throw new Error(message);
    }
  }
};
