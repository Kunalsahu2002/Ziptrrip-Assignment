import React from 'react';

interface Props {
  children: React.ReactNode;
  color?: 'gray' | 'red' | 'yellow' | 'green' | 'indigo' | 'blue';
  icon?: React.ReactNode;
}

export function Badge({ children, color = 'gray', icon }: Props) {
  const colors = {
    gray: { bg: 'var(--color-gray-100)', text: 'var(--color-gray-700)' },
    red: { bg: 'var(--color-danger-light)', text: 'var(--color-danger)' },
    yellow: { bg: 'var(--color-warning-light)', text: '#B45309' }, // Darker warning for contrast
    green: { bg: 'var(--color-success-light)', text: '#047857' }, // Darker green
    indigo: { bg: 'var(--color-primary-light)', text: 'var(--color-primary-hover)' },
    blue: { bg: '#E0F2FE', text: '#0369A1' }
  };

  const selected = colors[color];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.125rem 0.625rem',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem',
      fontWeight: 600,
      backgroundColor: selected.bg,
      color: selected.text,
      letterSpacing: '0.025em',
      textTransform: 'uppercase'
    }}>
      {icon && <span style={{ width: '0.75rem', height: '0.75rem', display: 'flex' }}>{icon}</span>}
      {children}
    </span>
  );
}
