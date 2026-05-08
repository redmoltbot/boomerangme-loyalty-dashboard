import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, CreditCard, Search, Phone, ArrowRight } from 'lucide-react'
import { useCustomers } from '../hooks/useCustomers'
import { useCards } from '../hooks/useCards'
import { StatCard } from '../components/ui/StatCard'
import { StatCardSkeleton } from '../components/ui/SkeletonLoader'
import { StampProgress } from '../components/ui/StampProgress'
import { CopyField } from '../components/ui/CopyField'
import { BOOMERANG_CONFIG } from '../config/boomerang'
import { debounce } from '../utils/debounce'

interface RecentLookup {
  query: string
  type: 'phone' | 'card' | 'customer'
  at: string
}

function useRecentLookups() {
  const [lookups, setLookups] = useState<RecentLookup[]>(() => {
    try { return JSON.parse(localStorage.getItem('recent_lookups') ?? '[]') } catch { return [] }
  })
  function add(lookup: RecentLookup) {
    setLookups((prev) => {
      const next = [lookup, ...prev.filter((l) => l.query !== lookup.query)].slice(0, 8)
      localStorage.setItem('recent_lookups', JSON.stringify(next))
      return next
    })
  }
  return { lookups, add }
}

export default function Overview() {
  const navigate = useNavigate()
  const { data: customers, isLoading: cLoading } = useCustomers()
  const { data: cards, isLoading: kLoading } = useCards()
  const { lookups } = useRecentLookups()
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<{ type: string; label: string; id: string }[]>([])
  const searchRef = useRef<HTMLInputElement>(null)

  const primaryCard = cards?.find((c) => String(c.templateId) === BOOMERANG_CONFIG.primaryCardId)

  const doSearch = debounce((q: string) => {
    if (!q.trim()) { setSearchResults([]); return }
    const results: typeof searchResults = []
    const lower = q.toLowerCase()
    customers?.forEach((c) => {
      const name = `${c.firstName ?? ''} ${c.lastName ?? ''}`.toLowerCase()
      if (name.includes(lower) || c.phone?.includes(q) || c.id.includes(q)) {
        results.push({ type: 'Customer', label: `${c.firstName} ${c.lastName} · ${c.phone ?? ''}`, id: c.id })
      }
    })
    cards?.forEach((k) => {
      if (k.number.toLowerCase().includes(lower) || k.id.includes(lower)) {
        results.push({ type: 'Card', label: `#${k.number}`, id: k.number })
      }
    })
    setSearchResults(results.slice(0, 6))
  }, 400)

  useEffect(() => { doSearch(search) }, [search, customers, cards])

  return (
    <div style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display, "Playfair Display", serif)' }}>
          Good day, {BOOMERANG_CONFIG.companyName}
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-muted)' }}>
          Here's a live snapshot of your loyalty programme.
        </p>
      </div>

      {/* Global search */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 14px',
            height: 44,
            borderRadius: 12,
            border: '1px solid var(--bdr)',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Search size={16} style={{ color: 'var(--text-faint)', flexShrink: 0 }} aria-hidden />
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or card number…"
            aria-label="Global search"
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: 14,
              color: 'var(--text)',
              outline: 'none',
            }}
          />
        </div>
        {searchResults.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: 'var(--surface)',
              border: '1px solid var(--bdr)',
              borderRadius: 12,
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden',
              zIndex: 50,
            }}
          >
            {searchResults.map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  navigate(r.type === 'Customer' ? `/customers/${r.id}` : `/cards/${r.id}`)
                  setSearch('')
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '11px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: i < searchResults.length - 1 ? '1px solid var(--bdr)' : 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <span style={{ fontSize: 11, color: 'var(--text-faint)', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>
                  {r.type}
                </span>
                <span style={{ fontSize: 14, color: 'var(--text)' }}>{r.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
        {cLoading ? <StatCardSkeleton /> : <StatCard label="Total Customers" value={customers?.length ?? 0} icon={<Users size={17} />} />}
        {kLoading ? <StatCardSkeleton /> : <StatCard label="Total Cards" value={cards?.length ?? 0} icon={<CreditCard size={17} />} />}
      </div>

      {/* Stamp card highlight */}
      {primaryCard && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--bdr)',
            borderRadius: 14,
            padding: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Primary Stamp Card
              </div>
              <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CopyField value={String(BOOMERANG_CONFIG.primaryCardId)} />
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>·</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Stamp Card</span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/cards/${primaryCard.number}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 8,
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              View card <ArrowRight size={14} />
            </button>
          </div>
          <StampProgress stamps={primaryCard.stamps ?? 0} maxStamps={primaryCard.maxStamps ?? 10} size="lg" />
          <div style={{ display: 'flex', gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Stamps</div>
              <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
                {primaryCard.stamps ?? 0}/{primaryCard.maxStamps ?? 10}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Rewards</div>
              <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--herb)', fontVariantNumeric: 'tabular-nums' }}>
                {primaryCard.rewards ?? 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
          Quick Actions
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[
            { label: 'Phone Lookup', icon: Phone, to: '/lookup' },
            { label: 'All Customers', icon: Users, to: '/customers' },
            { label: 'All Cards', icon: CreditCard, to: '/cards' },
          ].map(({ label, icon: Icon, to }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
                borderRadius: 10,
                border: '1px solid var(--bdr)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface)')}
            >
              <Icon size={15} style={{ color: 'var(--primary)' }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent lookups */}
      {lookups.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
            Recent Lookups
          </div>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--bdr)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {lookups.map((l, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderBottom: i < lookups.length - 1 ? '1px solid var(--bdr)' : 'none',
                }}
              >
                <Phone size={13} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: 'monospace' }}>{l.query}</span>
                <span style={{ fontSize: 11, color: 'var(--text-faint)', marginLeft: 'auto' }}>
                  {new Date(l.at).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
