import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Users } from 'lucide-react'
import { useCustomers } from '../hooks/useCustomers'
import { DataTable } from '../components/ui/DataTable'
import { TableSkeleton } from '../components/ui/SkeletonLoader'
import { EmptyState, ErrorState } from '../components/ui/EmptyState'
import { CopyField } from '../components/ui/CopyField'
import { formatDate } from '../utils/formatDate'
import type { Customer } from '../types/boomerang'

const PAGE_SIZE = 20

export default function ClientsList() {
  const navigate = useNavigate()
  const { data: customers, isLoading, error, refetch } = useCustomers()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const filtered = (customers ?? []).filter((c) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      `${c.firstName ?? ''} ${c.lastName ?? ''}`.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    )
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (c: Customer) => (
        <span style={{ fontWeight: 500, color: 'var(--text)' }}>
          {c.firstName || c.lastName
            ? `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim()
            : <span style={{ color: 'var(--text-faint)' }}>—</span>}
        </span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (c: Customer) =>
        c.email
          ? <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.email}</span>
          : <span style={{ color: 'var(--text-faint)' }}>—</span>,
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (c: Customer) =>
        c.phone ? <CopyField value={c.phone} /> : <span style={{ color: 'var(--text-faint)' }}>—</span>,
    },
    {
      key: 'cardNumber',
      label: 'Serial Card Num',
      render: (c: Customer) => {
        const num = c.cards?.[0]?.number
        return num ? <CopyField value={num} /> : <span style={{ color: 'var(--text-faint)' }}>—</span>
      },
    },
    {
      key: 'id',
      label: 'Customer ID',
      render: (c: Customer) => <CopyField value={c.id} />,
    },
    {
      key: 'dob',
      label: 'Date of Birth',
      render: (c: Customer) =>
        c.dateOfBirth
          ? <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(c.dateOfBirth)}</span>
          : <span style={{ color: 'var(--text-faint)' }}>—</span>,
    },
    {
      key: 'created',
      label: 'Joined',
      render: (c: Customer) => (
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(c.createdAt)}</span>
      ),
    },
  ]

  return (
    <div style={{ maxWidth: 1100, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Customers</h1>
          {customers && (
            <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
              {customers.length} total · {filtered.length} shown
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
            placeholder="Search customers…"
            aria-label="Search customers"
            style={{ border: 'none', background: 'transparent', fontSize: 13, color: 'var(--text)', outline: 'none', width: 180 }}
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
          <ErrorState message="Could not load customers." onRetry={() => refetch()} />
        ) : (
          <DataTable
            columns={columns}
            data={paged}
            keyFn={(c) => c.id}
            onRowClick={(c) => navigate(`/customers/${c.id}`)}
            emptyState={
              <EmptyState
                icon={<Users size={22} />}
                title="No customers found"
                message={search ? 'Try a different search term.' : 'No customers in your account yet.'}
              />
            }
          />
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid var(--bdr)',
              background: 'var(--surface)',
              color: 'var(--text-muted)',
              fontSize: 13,
              cursor: page === 0 ? 'not-allowed' : 'pointer',
              opacity: page === 0 ? 0.4 : 1,
            }}
          >
            Previous
          </button>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid var(--bdr)',
              background: 'var(--surface)',
              color: 'var(--text-muted)',
              fontSize: 13,
              cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
              opacity: page >= totalPages - 1 ? 0.4 : 1,
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
