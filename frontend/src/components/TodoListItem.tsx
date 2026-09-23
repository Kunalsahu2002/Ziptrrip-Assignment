import { useState } from "react";
import type { Todo } from "../types/todo";
import { Badge } from "./Badge";
import { format } from "date-fns";
import { MoreVertical, Calendar, Flag, Check, Trash2, Edit } from "lucide-react";

interface Props {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export function TodoListItem({ todo, onToggle, onDelete }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const isOverdue = !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date();

  return (
    <li style={{ 
      display: "flex", 
      alignItems: "flex-start", 
      justifyContent: "space-between",
      padding: "1.25rem",
      backgroundColor: "var(--color-surface)",
      border: "1px solid var(--color-gray-200)",
      boxShadow: "var(--shadow-card)",
      marginBottom: "0.75rem",
      borderRadius: "var(--radius-lg)",
      transition: "all 0.2s ease",
      opacity: todo.completed ? 0.7 : 1,
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flex: 1 }}>
        <div 
          onClick={() => onToggle(todo.id, !todo.completed)}
          style={{ 
            width: "20px", height: "20px", borderRadius: "4px", 
            border: `2px solid ${todo.completed ? "var(--color-primary)" : "var(--color-gray-300)"}`,
            backgroundColor: todo.completed ? "var(--color-primary)" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", marginTop: "0.15rem", flexShrink: 0,
            transition: "all 0.2s"
          }}
        >
          {todo.completed && <Check size={14} color="white" strokeWidth={3} />}
        </div>
        
        <div style={{ flex: 1 }}>
          <a href={`/todo.html?id=${todo.id}`} style={{ 
            fontWeight: 600, fontSize: "1rem", color: "var(--color-gray-900)",
            textDecoration: todo.completed ? "line-through" : "none",
            display: "block", marginBottom: "0.25rem"
          }}>
            {todo.title}
          </a>
          
          {todo.description && (
            <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", color: "var(--color-gray-500)",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
            }}>
              {todo.description}
            </p>
          )}
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <Badge 
              color={todo.priority === "HIGH" ? "red" : todo.priority === "MEDIUM" ? "yellow" : "blue"}
              icon={<Flag size={10} />}
            >
              {todo.priority}
            </Badge>
            
            <Badge color="gray">General</Badge>
            
            {todo.dueDate && (
              <Badge 
                color={isOverdue ? "red" : todo.completed ? "gray" : "green"} 
                icon={<Calendar size={10} />}
              >
                {format(new Date(todo.dueDate), "MMM d")}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div style={{ position: "relative" }}>
        <button 
          onClick={() => setShowMenu(!showMenu)}
          onBlur={() => setTimeout(() => setShowMenu(false), 200)}
          style={{ 
            background: "transparent", border: "none", color: "var(--color-gray-400)", 
            padding: "0.25rem", borderRadius: "var(--radius-md)", cursor: "pointer"
          }}
        >
          <MoreVertical size={20} />
        </button>
        
        {showMenu && (
          <div onMouseDown={(e) => e.preventDefault()} style={{ position: "absolute", top: "100%", right: 0, zIndex: 10,
            backgroundColor: "white", borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)", border: "1px solid var(--color-gray-200)",
            width: "140px", padding: "0.25rem", marginTop: "0.25rem"
          }}>
            <a href={`/todo.html?id=${todo.id}`} style={{ 
              display: "flex", alignItems: "center", gap: "0.5rem", 
              padding: "0.5rem", fontSize: "0.875rem", color: "var(--color-gray-700)",
              textDecoration: "none", borderRadius: "var(--radius-sm)",
            }}>
              <Edit size={14} /> View / Edit
            </a>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}
              style={{ 
                display: "flex", alignItems: "center", gap: "0.5rem", width: "100%",
                padding: "0.5rem", fontSize: "0.875rem", color: "var(--color-danger)",
                background: "none", border: "none", textAlign: "left", borderRadius: "var(--radius-sm)",
              }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>
    </li>
  );
}


