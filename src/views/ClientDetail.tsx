import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Activity, Tag } from 'lucide-react'
import { useCustomer } from '../hooks/useCustomers'
import { useOperations } from '../hooks/useOperations'
import { CopyField } from '../components/ui/CopyField'
import { StatusBadge, CardTypeBadge } from '../components/ui/StatusBadge'
import { StampBar } from '../components/ui/StampProgress'
import { Skeleton } from '../components/ui/SkeletonLoader'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDate, timeAgo } from '../utils/formatDate'
import { GENDER_LABELS } from '../types/boomerang'

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: customer, isLoading, error } = useCustomer(id ?? '')
  const { data: operations } = useOperations({ customerId: id })

  if (isLoading) {
    return (
      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Skeleton height={20} width={120} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={16} />)}
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div style={{ maxWidth: 720 }}>
        <button onClick={() => navigate('/customers')} style={backBtnStyle}>
          <ArrowLeft size={15} /> Back to Customers
        </button>
        <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--error)' }}>Customer not found.</div>
      </div>
    )
  }

  const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || '—'
  const initials = [customer.firstName?.[0], customer.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'
  const genderLabel = customer.gender != null ? (GENDER_LABELS[customer.gender] ?? '—') : '—'

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <button onClick={() => navigate('/customers')} style={backBtnStyle}>
        <ArrowLeft size={15} /> Back to Customers
      </button>

      {/* Identity */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>{fullName}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              Joined {formatDate(customer.createdAt)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <InfoRow label="Customer ID" value={<CopyField value={customer.id} />} />
          <InfoRow label="Phone" value={customer.phone ? <CopyField value={customer.phone} /> : '—'} />
          <InfoRow label="Email" value={customer.email || '—'} />
          <InfoRow label="Date of Birth" value={customer.dateOfBirth ? formatDate(customer.dateOfBirth) : '—'} />
          <InfoRow label="Gender" value={genderLabel} />
          <InfoRow label="LTV" value={customer.ltv != null ? `SGD ${customer.ltv.toFixed(2)}` : '—'} />
          {customer.updatedAt && (
            <InfoRow label="Last Updated" value={formatDate(customer.updatedAt)} />
          )}
        </div>

        {/* Segments */}
        {customer.segments && customer.segments.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 }}>Segments</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {customer.segments.map((seg) => (
                <span
                  key={seg.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 500,
                    background: 'rgba(122,74,30,0.10)',
                    color: 'var(--primary)',
                    border: '1px solid rgba(122,74,30,0.18)',
                  }}
                >
                  <Tag size={10} />
                  {seg.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cards */}
      <section>
        <SectionHeader icon={<CreditCard size={15} />} title="Linked Cards" />
        {!customer.cards || customer.cards.length === 0 ? (
          <EmptyState
            icon={<CreditCard size={20} />}
            title="No linked cards"
            message="This customer hasn't been issued a card yet."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {customer.cards.map((card) => (
              <div
                key={card.id}
                onClick={() => navigate(`/cards/${card.number}`)}
                style={{ ...cardStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/cards/${card.number}`)}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface)')}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <CopyField value={card.number} />
                    <CardTypeBadge cardType={card.cardType} />
                    <StatusBadge status={card.status} />
                  </div>
                </div>
                {card.cardType === 0 && <StampBar stamps={card.stamps ?? 0} maxStamps={card.maxStamps ?? 10} />}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Activity */}
      <section>
        <SectionHeader icon={<Activity size={15} />} title="Activity" />
        {!operations || operations.length === 0 ? (
          <EmptyState
            icon={<Activity size={20} />}
            title="No activity yet"
            message="Stamp and reward operations will appear here."
          />
        ) : (
          <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', marginTop: 10 }}>
            {operations.slice(0, 20).map((op, i) => (
              <div
                key={op.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '12px 16px',
                  borderBottom: i < Math.min(operations.length, 20) - 1 ? '1px solid var(--bdr)' : 'none',
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: op.value > 0 ? 'var(--success)' : 'var(--warning)',
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{op.type.replace(/_/g, ' ')}</div>
                  {op.comment && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{op.comment}</div>}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: op.value > 0 ? 'var(--success)' : 'var(--warning)', fontVariantNumeric: 'tabular-nums' }}>
                    {op.value > 0 ? `+${op.value}` : op.value}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 1 }}>{timeAgo(op.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 14, color: 'var(--text)' }}>{value}</div>
    </div>
  )
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
      <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</span>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--bdr)',
  borderRadius: 14,
  padding: '18px 20px',
  boxShadow: 'var(--shadow-sm)',
  transition: 'background 0.15s',
}

const backBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: 'var(--text-muted)',
  fontSize: 13,
  fontWeight: 500,
}
