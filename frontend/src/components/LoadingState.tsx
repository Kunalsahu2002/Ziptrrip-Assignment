export function LoadingState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton" style={{ 
          height: "100px", 
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-gray-100)"
        }} />
      ))}
    </div>
  );
}
