import { CheckSquare, Search, Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="glass-header">
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            backgroundColor: 'var(--color-primary)', color: 'white',
            padding: '0.4rem', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <CheckSquare size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.2 }}>TaskFlow</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', lineHeight: 1 }}>
              Stay organized. Get things done.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative', display: 'none' /* Will show on desktop */ }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              style={{
                paddingLeft: '2.5rem', width: '240px',
                backgroundColor: 'var(--color-gray-50)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-full)'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--color-gray-500)', position: 'relative' }}>
              <Bell size={20} />
              <span style={{ 
                position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', 
                backgroundColor: 'var(--color-danger)', borderRadius: '50%', border: '2px solid white'
              }} />
            </button>
            <div style={{
              width: '2rem', height: '2rem', borderRadius: '50%',
              backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, fontSize: '0.875rem'
            }}>
              JD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

