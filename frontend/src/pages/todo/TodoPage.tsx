import { useState, useEffect } from "react";
import type { Todo } from "../../types/todo";
import { todosClient } from "../../api/todosClient";
import { LoadingState } from "../../components/LoadingState";
import { ErrorState } from "../../components/ErrorState";
import { Header } from "../../components/Header";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { ArrowLeft, Flag, CheckCircle2, Clock, Trash2, Edit, Calendar } from "lucide-react";
import { format } from "date-fns";

export function TodoPage() {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    
    if (!id) {
      setError("No Task ID provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchTodo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await todosClient.get(id);
        setTodo(data);
      } catch (err: any) {
        setError(err.message || "Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, []);

  const handleToggle = async () => {
    if (!todo) return;
    try {
      const updated = !todo.completed;
      setTodo({ ...todo, completed: updated });
      await todosClient.update(todo.id, { completed: updated });
    } catch (err) {
      alert("Failed to update status");
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    if (!todo || !confirm("Are you sure you want to delete this task?")) return;
    try {
      await todosClient.delete(todo.id);
      window.location.href = "/todos.html";
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-background)" }}>
      <Header />
      
      <main className="container" style={{ flex: 1, padding: "2rem 1.5rem", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        
        <div style={{ marginBottom: "1.5rem" }}>
          <a href="/todos.html" style={{ 
            display: "inline-flex", alignItems: "center", gap: "0.5rem", 
            color: "var(--color-gray-500)", fontWeight: 500, fontSize: "0.875rem",
            textDecoration: "none"
          }}>
            <ArrowLeft size={16} /> Back to Tasks
          </a>
        </div>

        {loading && <LoadingState />}
        
        {error && !loading && (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        )}
        
        {!loading && !error && todo && (
          <div className="animate-fade-in" style={{ 
            backgroundColor: "var(--color-surface)", 
            borderRadius: "var(--radius-xl)", 
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--color-gray-200)",
            overflow: "hidden"
          }}>
            
            <div style={{ padding: "2.5rem 2.5rem 1.5rem 2.5rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <Badge 
                  color={todo.priority === "HIGH" ? "red" : todo.priority === "MEDIUM" ? "yellow" : "blue"}
                  icon={<Flag size={12} />}
                >
                  {todo.priority} PRIORITY
                </Badge>
              </div>
              
              <h1 style={{ 
                fontSize: "2rem", fontWeight: 800, color: "var(--color-gray-900)", 
                marginBottom: "1rem", lineHeight: 1.2,
                textDecoration: todo.completed ? "line-through" : "none",
                opacity: todo.completed ? 0.7 : 1
              }}>
                {todo.title}
              </h1>
              
              <p style={{ 
                color: todo.description ? "var(--color-gray-700)" : "var(--color-gray-400)", 
                fontSize: "1.125rem", lineHeight: 1.6, whiteSpace: "pre-wrap",
                marginBottom: "2.5rem"
              }}>
                {todo.description || "No description provided."}
              </p>

              {/* Two Column Grid */}
              <div style={{ 
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem",
                padding: "1.5rem", backgroundColor: "var(--color-gray-50)", 
                borderRadius: "var(--radius-lg)", border: "1px solid var(--color-gray-100)",
                marginBottom: "2rem"
              }}>
                <DetailRow label="Status" value={
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: todo.completed ? "var(--color-success)" : "var(--color-gray-700)", fontWeight: 500 }}>
                    {todo.completed ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                    {todo.completed ? "Completed" : "Active"}
                  </span>
                } />
                <DetailRow label="Priority" value={
                  <span style={{ textTransform: "capitalize", fontWeight: 500, color: "var(--color-gray-900)" }}>
                    {todo.priority.toLowerCase()}
                  </span>
                } />
                <DetailRow label="Category" value={<span style={{ fontWeight: 500, color: "var(--color-gray-900)" }}>General</span>} />
                <DetailRow label="Due Date" value={
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontWeight: 500, color: "var(--color-gray-900)" }}>
                    <Calendar size={16} color="var(--color-gray-500)" />
                    {todo.dueDate ? format(new Date(todo.dueDate), "MMMM d, yyyy") : "None"}
                  </span>
                } />
                <DetailRow label="Created" value={format(new Date(todo.createdAt), "MMM d, yyyy 'at' h:mm a")} />
                <DetailRow label="Last Updated" value={format(new Date(todo.updatedAt), "MMM d, yyyy 'at' h:mm a")} />
              </div>
              
              {/* Mock Tags */}
              <div style={{ marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-gray-500)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tags</h4>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Badge color="gray">Task</Badge>
                  <Badge color="gray">General</Badge>
                </div>
              </div>

            </div>
            
            {/* Footer Actions */}
            <div style={{ 
              padding: "1.5rem 2.5rem", backgroundColor: "var(--color-gray-50)",
              borderTop: "1px solid var(--color-gray-200)",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <Button variant="danger" icon={<Trash2 size={16} />} onClick={handleDelete}>
                Delete
              </Button>
              
              <div style={{ display: "flex", gap: "1rem" }}>
                <Button variant="secondary" icon={<Edit size={16} />} onClick={() => alert("Edit modal not implemented in this demo")}>
                  Edit Task
                </Button>
                <Button variant={todo.completed ? "secondary" : "primary"} icon={todo.completed ? <Clock size={16} /> : <CheckCircle2 size={16} />} onClick={handleToggle}>
                  {todo.completed ? "Mark Active" : "Mark Complete"}
                </Button>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

function DetailRow({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-gray-500)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
        {label}
      </div>
      <div style={{ fontSize: "0.95rem", color: "var(--color-gray-700)" }}>
        {value}
      </div>
    </div>
  );
}
