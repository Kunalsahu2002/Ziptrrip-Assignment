import { useState, useEffect, useCallback, useMemo } from "react";
import type { Todo, TodoStatus, TodoPriority } from "../../types/todo";
import { todosClient } from "../../api/todosClient";
import { TodoForm } from "../../components/TodoForm";
import { TodoListItem } from "../../components/TodoListItem";
import { FilterBar } from "../../components/FilterBar";
import { LoadingState } from "../../components/LoadingState";
import { ErrorState } from "../../components/ErrorState";
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { Plus, CheckCircle2, Clock, AlertCircle, LayoutList } from "lucide-react";

export function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todosClient.list(status);
      setTodos(data);
    } catch (err: any) {
      setError(err.message || "Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleCreate = async (data: { title: string; description?: string; priority?: TodoPriority; dueDate?: string | null }) => {
    await todosClient.create(data);
    fetchTodos(); // Refresh list
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      // Optimistic update
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed } : t));
      await todosClient.update(id, { completed });
      
      // If we are filtering, we might need to remove it from the list
      if (status !== "all") {
        fetchTodos();
      }
    } catch (err: any) {
      // Revert on error
      fetchTodos();
      alert(`Failed to update: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      setTodos(prev => prev.filter(t => t.id !== id));
      await todosClient.delete(id);
    } catch (err: any) {
      fetchTodos();
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    const overdue = todos.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;
    
    return { total, active, completed, overdue };
  }, [todos]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      
      <main className="container" style={{ flex: 1, padding: "2rem 1.5rem", maxWidth: "1024px", margin: "0 auto", width: "100%" }}>
        
        {/* Statistics Row */}
        <div style={{ 
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", 
          marginBottom: "2.5rem" 
        }}>
          <StatCard title="Total Tasks" value={stats.total} icon={<LayoutList size={20} />} color="var(--color-primary)" bg="var(--color-primary-light)" />
          <StatCard title="Active" value={stats.active} icon={<Clock size={20} />} color="var(--color-warning)" bg="var(--color-warning-light)" />
          <StatCard title="Completed" value={stats.completed} icon={<CheckCircle2 size={20} />} color="var(--color-success)" bg="var(--color-success-light)" />
          <StatCard title="Overdue" value={stats.overdue} icon={<AlertCircle size={20} />} color="var(--color-danger)" bg="var(--color-danger-light)" />
        </div>

        {/* Controls Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-gray-900)", marginBottom: "0.25rem" }}>My Tasks</h2>
            <p style={{ color: "var(--color-gray-500)", fontSize: "0.875rem" }}>Manage your tasks and stay productive.</p>
          </div>
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
            Add Task
          </Button>
        </div>
        
        <FilterBar status={status} onChange={setStatus} />
        
        {/* Content */}
        {error && <ErrorState message={error} onRetry={fetchTodos} />}
        
        {!error && loading && <LoadingState />}
        
        {!error && !loading && todos.length === 0 && (
          <div className="animate-fade-in" style={{ 
            textAlign: "center", padding: "4rem 2rem", 
            backgroundColor: "var(--color-surface)", 
            borderRadius: "var(--radius-lg)", border: "1px dashed var(--color-gray-300)" 
          }}>
            <div style={{ display: "inline-flex", padding: "1rem", backgroundColor: "var(--color-primary-light)", borderRadius: "var(--radius-full)", marginBottom: "1rem" }}>
              <CheckCircle2 size={32} color="var(--color-primary)" />
            </div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-gray-900)", marginBottom: "0.5rem" }}>
              You're all caught up!
            </h3>
            <p style={{ color: "var(--color-gray-500)", marginBottom: "1.5rem" }}>
              Create your first task and start organizing your work.
            </p>
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} style={{ marginRight: '0.25rem' }} /> Create Task
            </Button>
          </div>
        )}
        
        {!error && !loading && todos.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {todos.map(todo => (
              <TodoListItem 
                key={todo.id} 
                todo={todo} 
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </main>

      <TodoForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreate} 
      />
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }: { title: string, value: number, icon: React.ReactNode, color: string, bg: string }) {
  return (
    <div style={{ 
      backgroundColor: "var(--color-surface)", 
      padding: "1.25rem", 
      borderRadius: "var(--radius-lg)", 
      boxShadow: "var(--shadow-sm)",
      border: "1px solid var(--color-gray-200)",
      display: "flex", alignItems: "flex-start", gap: "1rem"
    }}>
      <div style={{ 
        backgroundColor: bg, color: color, 
        padding: "0.75rem", borderRadius: "var(--radius-md)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-gray-900)", lineHeight: 1.2 }}>
          {value}
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--color-gray-500)", fontWeight: 500 }}>
          {title}
        </div>
      </div>
    </div>
  );
}
