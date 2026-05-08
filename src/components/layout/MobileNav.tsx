import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, CreditCard, Search } from 'lucide-react'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/clients', icon: Users, label: 'Customers' },
  { to: '/cards', icon: CreditCard, label: 'Cards' },
  { to: '/lookup', icon: Search, label: 'Lookup' },
]

export function MobileNav() {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--surface)',
        borderTop: '1px solid var(--bdr)',
        display: 'flex',
        zIndex: 40,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      aria-label="Mobile navigation"
    >
      {nav.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            padding: '10px 4px 8px',
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--text-faint)',
            fontSize: 10,
            fontWeight: 500,
            transition: 'color 0.15s',
          })}
          aria-current={undefined}
        >
          {({ isActive }) => (
            <>
              <Icon size={20} strokeWidth={isActive ? 2 : 1.6} aria-hidden />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
