import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, CreditCard } from 'lucide-react'
import { useCards } from '../hooks/useCards'
import { DataTable } from '../components/ui/DataTable'
import { TableSkeleton } from '../components/ui/SkeletonLoader'
import { EmptyState, ErrorState } from '../components/ui/EmptyState'
import { CardTypeBadge, StatusBadge } from '../components/ui/StatusBadge'
import { StampBar } from '../components/ui/StampProgress'
import { CopyField } from '../components/ui/CopyField'
import { formatDate } from '../utils/formatDate'
import type { Card } from '../types/boomerang'

const PAGE_SIZE = 20

export default function CardsList() {
  const navigate = useNavigate()
  const { data: cards, isLoading, error, refetch } = useCards()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const filtered = (cards ?? []).filter((c) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return c.number.toLowerCase().includes(q) || c.customerId?.toLowerCase().includes(q) || String(c.templateId).includes(q)
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const columns = [
    {
      key: 'number',
      label: 'Card Number',
      render: (c: Card) => <CopyField value={c.number} />,
    },
    {
      key: 'type',
      label: 'Type',
      render: (c: Card) => <CardTypeBadge cardType={c.cardType} />,
    },
    {
      key: 'template',
      label: 'Template',
      render: (c: Card) => <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.templateId}</span>,
    },
    {
      key: 'stamps',
      label: 'Progress',
      render: (c: Card) =>
        c.cardType === 0 ? (
          <StampBar stamps={c.stamps ?? 0} maxStamps={c.maxStamps ?? 10} />
        ) : (
          <span style={{ color: 'var(--text-faint)', fontSize: 13 }}>—</span>
        ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (c: Card) => <StatusBadge status={c.status} />,
    },
    {
      key: 'created',
      label: 'Issued',
      render: (c: Card) => <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(c.createdAt)}</span>,
    },
  ]

  return (
    <div style={{ maxWidth: 1000, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Cards</h1>
          {cards && (
            <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
              {cards.length} total · {filtered.length} shown
            </p>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 12px',
            height: 40,
            borderRadius: 10,
            border: '1px solid var(--bdr)',
            background: 'var(--surface)',
          }}
        >
          <Search size={14} style={{ color: 'var(--text-faint)' }} aria-hidden />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            placeholder="Search cards…"
            aria-label="Search cards"
            style={{ border: 'none', background: 'transparent', fontSize: 13, color: 'var(--text)', outline: 'none', width: 160 }}
          />
        </div>
      </div>

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--bdr)',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {isLoading ? (
          <TableSkeleton rows={8} />
        ) : error ? (
          <ErrorState message="Could not load cards." onRetry={() => refetch()} />
        ) : (
          <DataTable
            columns={columns}
            data={paged}
            keyFn={(c) => c.id}
            onRowClick={(c) => navigate(`/cards/${c.number}`)}
            emptyState={
              <EmptyState
                icon={<CreditCard size={22} />}
                title="No cards found"
                message={search ? 'Try a different search term.' : 'No cards issued yet.'}
              />
            }
          />
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} style={pagerBtn(page === 0)}>Previous</button>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} style={pagerBtn(page >= totalPages - 1)}>Next</button>
        </div>
      )}
    </div>
  )
}

function pagerBtn(disabled: boolean): React.CSSProperties {
  return {
    padding: '6px 14px',
    borderRadius: 8,
    border: '1px solid var(--bdr)',
    background: 'var(--surface)',
    color: 'var(--text-muted)',
    fontSize: 13,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
  }
}
