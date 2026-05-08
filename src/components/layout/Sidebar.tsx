import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, CreditCard, Search, Sun, Moon } from 'lucide-react'
import { ApiHealthIndicator } from '../ui/ApiHealthIndicator'
import { BOOMERANG_CONFIG } from '../../config/boomerang'

interface SidebarProps {
  dark: boolean
  onToggleDark: () => void
}

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/clients', icon: Users, label: 'Customers' },
  { to: '/cards', icon: CreditCard, label: 'Cards' },
  { to: '/lookup', icon: Search, label: 'Lookup' },
]

const linkBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '9px 12px',
  borderRadius: 9,
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--text-muted)',
  textDecoration: 'none',
  transition: 'background 0.15s, color 0.15s',
  cursor: 'pointer',
}

export function Sidebar({ dark, onToggleDark }: SidebarProps) {
  return (
    <aside
      style={{
        width: 228,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--bdr)',
        background: 'var(--surface)',
        height: '100dvh',
        position: 'fixed',
        left: 0,
        top: 0,
        padding: '0 12px',
        zIndex: 40,
        overflowY: 'auto',
      }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div style={{ padding: '20px 6px 18px', borderBottom: '1px solid var(--bdr)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C9.24 2 7 4.24 7 7c0 1.41.52 2.7 1.38 3.67C5.84 11.69 4 14.16 4 17c0 .55.45 1 1 1h14c.55 0 1-.45 1-1 0-2.84-1.84-5.31-4.38-6.33C16.48 9.7 17 8.41 17 7c0-2.76-2.24-5-5-5z"
                fill="rgba(255,240,210,0.9)" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>
              {BOOMERANG_CONFIG.companyName}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', lineHeight: 1.3 }}>Loyalty Dashboard</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ marginTop: 12, flex: 1 }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {nav.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                style={({ isActive }) => ({
                  ...linkBase,
                  background: isActive ? 'rgba(122,74,30,0.10)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                })}
              >
                <Icon size={17} strokeWidth={1.8} aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--bdr)', paddingTop: 12, paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ApiHealthIndicator />
        <button
          onClick={onToggleDark}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'none',
            border: 'none',
            padding: '6px 4px',
            cursor: 'pointer',
            color: 'var(--text-faint)',
            fontSize: 12,
            borderRadius: 6,
          }}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
          {dark ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </aside>
  )
}
