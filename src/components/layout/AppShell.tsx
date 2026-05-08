import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { TopBar } from './TopBar'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Overview',
  '/clients': 'Customers',
  '/cards': 'Cards',
  '/lookup': 'Lookup',
}

export default function AppShell() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const title = PAGE_TITLES[location.pathname] ?? 'Bakery Singapore'

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)' }}>
      {/* Skip link for keyboard users */}
      <a
        href="#main"
        style={{
          position: 'absolute',
          left: -9999,
          top: 'auto',
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = '16px'
          e.currentTarget.style.top = '16px'
          e.currentTarget.style.width = 'auto'
          e.currentTarget.style.height = 'auto'
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = '-9999px'
          e.currentTarget.style.top = 'auto'
          e.currentTarget.style.width = '1px'
          e.currentTarget.style.height = '1px'
        }}
      >
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar dark={dark} onToggleDark={() => setDark((d) => !d)} />
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
        className="lg:ml-[228px]"
      >
        {/* Mobile top bar */}
        <div className="lg:hidden">
          <TopBar title={title} dark={dark} onToggleDark={() => setDark((d) => !d)} />
        </div>

        <main
          id="main"
          style={{
            flex: 1,
            minWidth: 0,
            padding: '24px 24px',
          }}
          className="pb-[calc(80px+env(safe-area-inset-bottom,0px))] lg:pb-6"
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  )
}
