import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Search, CheckCircle, XCircle, AlertTriangle, ArrowRight, User, Mail } from 'lucide-react'
import { usePhoneLookup } from '../hooks/usePhoneLookup'
import { useCustomerSearch } from '../hooks/useCustomerSearch'
import { CopyField } from '../components/ui/CopyField'
import { CardTypeBadge, StatusBadge } from '../components/ui/StatusBadge'
import { StampBar } from '../components/ui/StampProgress'
import { Skeleton } from '../components/ui/SkeletonLoader'
import { formatDate } from '../utils/formatDate'
import type { Customer } from '../types/boomerang'

type SearchType = 'phone' | 'name' | 'email'
type PhoneMode = 'existence' | 'card' | 'customer'

const SEARCH_TABS: { value: SearchType; label: string; icon: React.ElementType; placeholder: string }[] = [
  { value: 'phone', label: 'Phone', icon: Phone, placeholder: 'e.g. 6590903345' },
  { value: 'name', label: 'Name', icon: User, placeholder: 'e.g. John Tan' },
  { value: 'email', label: 'Email', icon: Mail, placeholder: 'e.g. john@example.com' },
]

const PHONE_MODES: { value: PhoneMode; label: string; desc: string }[] = [
  { value: 'existence', label: 'Card Check', desc: 'Does a card exist?' },
  { value: 'card', label: 'Card Info', desc: 'Full card details' },
  { value: 'customer', label: 'Customer Info', desc: 'Customer record' },
]

function saveRecentLookup(query: string, type: SearchType) {
  try {
    const prev = JSON.parse(localStorage.getItem('recent_lookups') ?? '[]')
    const next = [
      { query, type, at: new Date().toISOString() },
      ...prev.filter((l: { query: string; type: string }) => !(l.query === query && l.type === type)),
    ].slice(0, 8)
    localStorage.setItem('recent_lookups', JSON.stringify(next))
  } catch {}
}

export default function PhoneLookup() {
  const navigate = useNavigate()

  const [searchType, setSearchType] = useState<SearchType>('phone')
  const [query, setQuery] = useState('')
  const [phoneMode, setPhoneMode] = useState<PhoneMode>('existence')

  const { loading, error, found, card, customer, isRateLimit, lookup, reset, dataLoading } = usePhoneLookup()
  const { searchByName, searchByEmail, isLoading: searchLoading } = useCustomerSearch()

  // Live results for name/email tabs
  const textResults: Customer[] =
    searchType === 'name'
      ? searchByName(query)
      : searchType === 'email'
      ? searchByEmail(query)
      : []

  function handleSwitchTab(tab: SearchType) {
    setSearchType(tab)
    setQuery('')
    reset()
  }

  function handlePhoneLookup() {
    saveRecentLookup(query, 'phone')
    lookup(query, phoneMode)
  }

  const InputIcon = SEARCH_TABS.find((t) => t.value === searchType)!.icon
  const inputPlaceholder = SEARCH_TABS.find((t) => t.value === searchType)!.placeholder

  return (
    <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Lookup</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-muted)' }}>
          Find a customer by phone number, name, or email.
        </p>
      </div>

      {/* Search type tabs */}
      <div
        style={{
          display: 'flex',
          background: 'var(--surface)',
          border: '1px solid var(--bdr)',
          borderRadius: 12,
          padding: 4,
          gap: 4,
        }}
        role="tablist"
        aria-label="Search type"
      >
        {SEARCH_TABS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            role="tab"
            aria-selected={searchType === value}
            onClick={() => handleSwitchTab(value)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              padding: '8px 12px',
              borderRadius: 9,
              border: 'none',
              background: searchType === value ? 'var(--primary)' : 'transparent',
              color: searchType === value ? '#fff' : 'var(--text-muted)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Icon size={14} aria-hidden />
            {label}
          </button>
        ))}
      </div>

      {/* Phone sub-modes (only on phone tab) */}
      {searchType === 'phone' && (
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}
          role="group"
          aria-label="Phone lookup mode"
        >
          {PHONE_MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => { setPhoneMode(m.value); reset() }}
              style={{
                padding: '10px 8px',
                borderRadius: 10,
                border: phoneMode === m.value ? '1.5px solid var(--primary)' : '1px solid var(--bdr)',
                background: phoneMode === m.value ? 'rgba(122,74,30,0.08)' : 'var(--surface)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
              aria-pressed={phoneMode === m.value}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: phoneMode === m.value ? 'var(--primary)' : 'var(--text)' }}>
                {m.label}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2, lineHeight: 1.3 }}>{m.desc}</div>
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div>
        <label
          htmlFor="lookup-input"
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}
        >
          {searchType === 'phone' ? 'Phone Number' : searchType === 'name' ? 'Customer Name' : 'Email Address'}
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0 14px',
              height: 46,
              borderRadius: 12,
              border: '1px solid var(--bdr)',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <InputIcon size={15} style={{ color: 'var(--text-faint)', flexShrink: 0 }} aria-hidden />
            <input
              id="lookup-input"
              type={searchType === 'email' ? 'email' : 'text'}
              inputMode={searchType === 'phone' ? 'tel' : 'text'}
              value={query}
              onChange={(e) => { setQuery(e.target.value); if (searchType === 'phone') reset() }}
              onKeyDown={(e) => { if (e.key === 'Enter' && searchType === 'phone') handlePhoneLookup() }}
              placeholder={inputPlaceholder}
              autoComplete={searchType === 'email' ? 'email' : 'off'}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontSize: 15,
                color: 'var(--text)',
                outline: 'none',
                fontFamily: searchType === 'phone' ? 'ui-monospace, monospace' : 'inherit',
              }}
            />
          </div>
          {searchType === 'phone' && (
            <button
              onClick={handlePhoneLookup}
              disabled={loading || dataLoading || query.length < 4}
              style={{
                height: 46,
                padding: '0 20px',
                borderRadius: 12,
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: loading || dataLoading || query.length < 4 ? 'not-allowed' : 'pointer',
                opacity: loading || dataLoading || query.length < 4 ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'opacity 0.15s',
              }}
              aria-label="Search"
            >
              {(loading || dataLoading) ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
              ) : (
                <Search size={15} />
              )}
              {dataLoading ? 'Loading…' : loading ? 'Searching…' : 'Search'}
            </button>
          )}
        </div>
        <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--text-faint)' }}>
          {searchType === 'phone'
            ? 'Enter the phone number exactly as stored, e.g. 6590903345.'
            : searchType === 'name'
            ? 'Type at least 2 characters — results appear as you type.'
            : 'Type at least 2 characters — results appear as you type.'}
        </p>
      </div>

      {/* ── PHONE RESULTS ── */}
      {searchType === 'phone' && (
        <>
          {isRateLimit && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(192,94,30,0.08)', border: '1px solid rgba(192,94,30,0.2)' }}>
              <AlertTriangle size={14} style={{ color: 'var(--warning)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--warning)' }}>Rate limit reached — retrying automatically…</span>
            </div>
          )}

          {loading && !isRateLimit && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Skeleton height={14} width="60%" />
              <Skeleton height={80} borderRadius={12} />
            </div>
          )}

          {found === false && !loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderRadius: 12, background: 'rgba(155,44,58,0.07)', border: '1px solid rgba(155,44,58,0.15)' }}>
              <XCircle size={20} style={{ color: 'var(--error)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--error)' }}>Not found</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                  No {phoneMode === 'customer' ? 'customer' : 'card'} linked to{' '}
                  <span style={{ fontFamily: 'monospace' }}>{query}</span>
                </div>
              </div>
            </div>
          )}

          {error && !isRateLimit && !loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 12, background: 'rgba(155,44,58,0.07)', border: '1px solid rgba(155,44,58,0.15)' }}>
              <XCircle size={18} style={{ color: 'var(--error)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--error)' }}>{error}</span>
            </div>
          )}

          {found && card && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--success)' }}>
                  {phoneMode === 'existence' ? 'Card found' : 'Card info retrieved'}
                </span>
              </div>
              <div style={resultCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <CopyField value={card.number} />
                  <CardTypeBadge cardType={card.cardType} />
                  <StatusBadge status={card.status} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <InfoRow label="Template ID" value={<CopyField value={String(card.templateId)} />} />
                  <InfoRow label="Issued" value={formatDate(card.createdAt)} />
                  {card.customerId && <InfoRow label="Customer ID" value={<CopyField value={card.customerId} />} />}
                </div>
                {card.cardType === 0 && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--bdr)' }}>
                    <StampBar stamps={card.stamps ?? 0} maxStamps={card.maxStamps ?? 10} />
                    <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        Rewards: <strong style={{ color: 'var(--success)' }}>{card.rewards ?? 0}</strong>
                      </span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => navigate(`/cards/${card.number}`)}
                  style={viewBtn}
                >
                  View card <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {found && customer && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--success)' }}>Customer found</span>
              </div>
              <CustomerResultCard customer={customer} onView={() => navigate(`/clients/${customer.id}`)} />
            </div>
          )}
        </>
      )}

      {/* ── NAME / EMAIL RESULTS ── */}
      {(searchType === 'name' || searchType === 'email') && (
        <>
          {searchLoading && query.length >= 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Skeleton height={14} width="40%" />
              <Skeleton height={72} borderRadius={12} />
            </div>
          )}

          {!searchLoading && query.length >= 2 && textResults.length === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderRadius: 12, background: 'rgba(155,44,58,0.07)', border: '1px solid rgba(155,44,58,0.15)' }}>
              <XCircle size={20} style={{ color: 'var(--error)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--error)' }}>No matches</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                  No customers found for "{query}".
                </div>
              </div>
            </div>
          )}

          {textResults.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
                {textResults.length} result{textResults.length !== 1 ? 's' : ''} found
              </div>
              {textResults.slice(0, 10).map((c) => (
                <CustomerResultCard
                  key={c.id}
                  customer={c}
                  onView={() => navigate(`/clients/${c.id}`)}
                />
              ))}
              {textResults.length > 10 && (
                <p style={{ fontSize: 12, color: 'var(--text-faint)', textAlign: 'center', margin: 0 }}>
                  {textResults.length - 10} more results — refine your search to narrow down.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function CustomerResultCard({ customer, onView }: { customer: Customer; onView: () => void }) {
  const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || '—'
  return (
    <div style={resultCard}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <InfoRow label="Name" value={fullName} />
        <InfoRow label="Customer ID" value={<CopyField value={customer.id} />} />
        <InfoRow label="Phone" value={customer.phone ? <CopyField value={customer.phone} /> : '—'} />
        <InfoRow label="Email" value={customer.email || '—'} />
        {customer.dateOfBirth && <InfoRow label="Date of Birth" value={formatDate(customer.dateOfBirth)} />}
        <InfoRow label="Joined" value={formatDate(customer.createdAt)} />
      </div>
      <button onClick={onView} style={viewBtn}>
        View profile <ArrowRight size={13} />
      </button>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 13, color: 'var(--text)' }}>{value}</div>
    </div>
  )
}

const resultCard: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--bdr)',
  borderRadius: 14,
  padding: '18px 20px',
  boxShadow: 'var(--shadow-sm)',
}

const viewBtn: React.CSSProperties = {
  marginTop: 16,
  display: 'inline-flex',
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
}
