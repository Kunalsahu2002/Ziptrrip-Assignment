import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface Props {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="animate-fade-in" style={{ 
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "3rem 1.5rem", textAlign: "center", 
      backgroundColor: "var(--color-surface)",
      border: "1px solid var(--color-gray-200)", 
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-sm)"
    }}>
      <div style={{ color: "var(--color-danger)", marginBottom: "1rem" }}>
        <AlertCircle size={48} strokeWidth={1.5} />
      </div>
      <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-gray-900)", marginBottom: "0.5rem" }}>
        Something went wrong
      </h3>
      <p style={{ color: "var(--color-gray-500)", marginBottom: "1.5rem", maxWidth: "400px" }}>
        {message || "We couldn't load your tasks. Please try again."}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
