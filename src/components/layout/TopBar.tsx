import { Sun, Moon } from 'lucide-react'
import { BOOMERANG_CONFIG } from '../../config/boomerang'

interface TopBarProps {
  title?: string
  dark: boolean
  onToggleDark: () => void
}

export function TopBar({ title, dark, onToggleDark }: TopBarProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--bdr)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        height: 52,
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C9.24 2 7 4.24 7 7c0 1.41.52 2.7 1.38 3.67C5.84 11.69 4 14.16 4 17c0 .55.45 1 1 1h14c.55 0 1-.45 1-1 0-2.84-1.84-5.31-4.38-6.33C16.48 9.7 17 8.41 17 7c0-2.76-2.24-5-5-5z"
              fill="rgba(255,240,210,0.9)" />
          </svg>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {title ?? BOOMERANG_CONFIG.companyName}
        </span>
      </div>

      <button
        onClick={onToggleDark}
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          border: '1px solid var(--bdr)',
          background: 'var(--surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          flexShrink: 0,
        }}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    </header>
  )
}
