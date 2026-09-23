import type { TodoStatus } from "../types/todo";

interface Props {
  status: TodoStatus;
  onChange: (status: TodoStatus) => void;
}

export function FilterBar({ status, onChange }: Props) {
  const tabs: { value: TodoStatus; label: string }[] = [
    { value: "all", label: "All Tasks" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div style={{ display: "flex", gap: "1.5rem", borderBottom: "1px solid var(--color-gray-200)", marginBottom: "1.5rem" }}>
      {tabs.map(tab => (
        <button 
          key={tab.value}
          onClick={() => onChange(tab.value)}
          style={{ 
            background: "transparent", 
            border: "none", 
            padding: "0.75rem 0",
            fontSize: "0.875rem",
            fontWeight: status === tab.value ? 600 : 500,
            color: status === tab.value ? "var(--color-primary)" : "var(--color-gray-500)",
            borderBottom: status === tab.value ? "2px solid var(--color-primary)" : "2px solid transparent",
            marginBottom: "-1px"
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
