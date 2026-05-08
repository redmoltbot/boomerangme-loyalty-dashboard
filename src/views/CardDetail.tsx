import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Activity, Gift, Star, ExternalLink, Tag, Stamp } from 'lucide-react'
import { useCard, useStampActions } from '../hooks/useCards'
import { useOperations } from '../hooks/useOperations'
import { CopyField } from '../components/ui/CopyField'
import { CardTypeBadge, StatusBadge } from '../components/ui/StatusBadge'
import { StampProgress } from '../components/ui/StampProgress'
import { Skeleton } from '../components/ui/SkeletonLoader'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDate, timeAgo } from '../utils/formatDate'
import { BOOMERANG_CONFIG } from '../config/boomerang'
import { GENDER_LABELS } from '../types/boomerang'

export default function CardDetail() {
  const { cardNumber } = useParams<{ cardNumber: string }>()
  const navigate = useNavigate()
  const { data: card, isLoading, error } = useCard(cardNumber ?? '')
  const { data: operations } = useOperations({ cardNumber })
  const { add: addStamp, subtract: subtractStamp } = useStampActions(cardNumber ?? '')

  const [stampCount, setStampCount] = useState(1)
  const [stampComment, setStampComment] = useState('')
  const [purchaseSum, setPurchaseSum] = useState('')
  const [stampFeedback, setStampFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  async function handleStampAction(action: 'add' | 'subtract') {
    setStampFeedback(null)
    const body = {
      stamps: stampCount,
      comment: stampComment || null,
      purchaseSum: purchaseSum !== '' ? parseFloat(purchaseSum) : null,
    }
    try {
      if (action === 'add') await addStamp.mutateAsync(body)
      else await subtractStamp.mutateAsync(body)
      setStampFeedback({ type: 'success', msg: action === 'add' ? `Added ${stampCount} stamp(s)` : `Subtracted ${stampCount} stamp(s)` })
      setStampCount(1)
      setStampComment('')
      setPurchaseSum('')
    } catch (e: unknown) {
      setStampFeedback({ type: 'error', msg: e instanceof Error ? e.message : 'Action failed' })
    }
  }

  if (isLoading) {
    return (
      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Skeleton height={18} width={100} />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={80} borderRadius={12} />)}
      </div>
    )
  }

  if (error || !card) {
    return (
      <div style={{ maxWidth: 720 }}>
        <button onClick={() => navigate('/cards')} style={backBtnStyle}>
          <ArrowLeft size={15} /> Back to Cards
        </button>
        <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--error)' }}>Card not found.</div>
      </div>
    )
  }

  const isPrimary = String(card.templateId) === BOOMERANG_CONFIG.primaryCardId

  const hasEngagement = (
    card.countVisits != null ||
    card.totalRewardsEarned != null ||
    card.totalRewardsRedeemed != null ||
    card.totalStampsEarnedByReferral != null ||
    card.totalPointsEarnedByReferral != null ||
    card.couponRedeemed != null
  )

  const hasTimeline = (
    card.lastStampEarnedAt ||
    card.lastRewardEarnedAt ||
    card.lastRewardRedeemedAt ||
    card.expiresAt
  )

  const activeCustomFields = card.customFields?.filter((f) => f.value) ?? []

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <button onClick={() => navigate('/cards')} style={backBtnStyle}>
        <ArrowLeft size={15} /> Back to Cards
      </button>

      {/* Card header */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <CopyField value={card.number} />
              <CardTypeBadge cardType={card.cardType} />
              <StatusBadge status={card.status} />
              {isPrimary && (
                <span style={{ fontSize: 11, background: 'rgba(200,150,26,0.15)', color: '#a07a10', padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>
                  Primary
                </span>
              )}
              {card.couponRedeemed && (
                <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.12)', color: 'var(--success)', padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>
                  Coupon Redeemed
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-faint)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span>Template {card.templateId}</span>
              {card.device && <span>Device: {card.device}</span>}
              <span>Issued {formatDate(card.createdAt)}</span>
              {card.expiresAt && <span style={{ color: 'var(--warning)' }}>Expires {formatDate(card.expiresAt)}</span>}
            </div>
          </div>
        </div>

        {/* Stamp visualization */}
        {card.cardType === 0 && (
          <div style={{ marginTop: 20, padding: '18px', background: 'var(--surface-2)', borderRadius: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
              Stamp Progress
            </div>
            <StampProgress stamps={card.stamps ?? 0} maxStamps={card.maxStamps ?? 10} size="lg" />
            <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
              <Metric label="Stamps" value={`${card.stamps ?? 0} / ${card.maxStamps ?? 10}`} color="var(--accent)" />
              <Metric label="Rewards Available" value={String(card.rewards ?? 0)} color="var(--success)" />
              {card.visits != null && <Metric label="Visits" value={String(card.visits)} color="var(--primary)" />}
            </div>

            {/* Stamp actions */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--bdr)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                <Stamp size={13} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)' }}>
                  Stamp Actions
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                  <div style={inputLabelStyle}>Stamps *</div>
                  <input
                    type="number"
                    min={1}
                    value={stampCount}
                    onChange={(e) => setStampCount(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{ ...inputStyle, width: 72 }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={inputLabelStyle}>Comment</div>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={stampComment}
                    onChange={(e) => setStampComment(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ minWidth: 100 }}>
                  <div style={inputLabelStyle}>Purchase Sum</div>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="Optional"
                    value={purchaseSum}
                    onChange={(e) => setPurchaseSum(e.target.value)}
                    style={{ ...inputStyle, width: 100 }}
                  />
                </div>
                <button
                  onClick={() => handleStampAction('add')}
                  disabled={addStamp.isPending || subtractStamp.isPending}
                  style={{ ...actionBtnStyle, background: 'var(--success)', color: '#fff' }}
                >
                  + Add
                </button>
                <button
                  onClick={() => handleStampAction('subtract')}
                  disabled={addStamp.isPending || subtractStamp.isPending}
                  style={{ ...actionBtnStyle, background: 'var(--warning)', color: '#fff' }}
                >
                  − Subtract
                </button>
              </div>
              {stampFeedback && (
                <div style={{ marginTop: 10, fontSize: 12, color: stampFeedback.type === 'success' ? 'var(--success)' : 'var(--error)', fontWeight: 500 }}>
                  {stampFeedback.msg}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Non-stamp metrics */}
        {card.cardType !== 0 && (
          <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
            {card.points != null && <Metric label="Points" value={String(card.points)} color="var(--accent)" />}
            {card.amount != null && <Metric label="Amount" value={`SGD ${card.amount.toFixed(2)}`} color="var(--success)" />}
            {card.scores != null && <Metric label="Scores" value={String(card.scores)} color="var(--primary)" />}
            {card.visits != null && <Metric label="Visits" value={String(card.visits)} color="var(--herb)" />}
          </div>
        )}
      </div>

      {/* Engagement stats */}
      {hasEngagement && (
        <section>
          <SectionHeader icon={<Star size={15} />} title="Engagement" />
          <div style={{ ...cardStyle, marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            {card.countVisits != null && (
              <InfoRow label="Total Visits" value={String(card.countVisits)} />
            )}
            {card.totalRewardsEarned != null && (
              <InfoRow label="Rewards Earned" value={String(card.totalRewardsEarned)} />
            )}
            {card.totalRewardsRedeemed != null && (
              <InfoRow label="Rewards Redeemed" value={String(card.totalRewardsRedeemed)} />
            )}
            {card.totalStampsEarnedByReferral != null && card.totalStampsEarnedByReferral > 0 && (
              <InfoRow label="Stamps via Referral" value={String(card.totalStampsEarnedByReferral)} />
            )}
            {card.totalPointsEarnedByReferral != null && card.totalPointsEarnedByReferral > 0 && (
              <InfoRow label="Points via Referral" value={String(card.totalPointsEarnedByReferral)} />
            )}
            {card.firstVisitDiscount && (
              <InfoRow label="First Visit Discount" value={card.firstVisitDiscount} />
            )}
          </div>
        </section>
      )}

      {/* Activity timeline */}
      {hasTimeline && (
        <section>
          <SectionHeader icon={<Activity size={15} />} title="Key Dates" />
          <div style={{ ...cardStyle, marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            {card.lastStampEarnedAt && (
              <InfoRow label="Last Stamp Earned" value={formatDate(card.lastStampEarnedAt)} />
            )}
            {card.lastRewardEarnedAt && (
              <InfoRow label="Last Reward Earned" value={formatDate(card.lastRewardEarnedAt)} />
            )}
            {card.lastRewardRedeemedAt && (
              <InfoRow label="Last Reward Redeemed" value={formatDate(card.lastRewardRedeemedAt)} />
            )}
            {card.expiresAt && (
              <InfoRow label="Card Expires" value={formatDate(card.expiresAt)} />
            )}
          </div>
        </section>
      )}

      {/* Membership tier */}
      {card.membershipTier && (
        <section>
          <SectionHeader icon={<Star size={15} />} title="Membership Tier" />
          <div style={{ ...cardStyle, marginTop: 10 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>
              {card.membershipTier.name}
            </div>
            {card.membershipTier.description && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
                {card.membershipTier.description}
              </div>
            )}
            {card.membershipTier.benefits && card.membershipTier.benefits.length > 0 && (
              <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {card.membershipTier.benefits.map((b, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'var(--text-muted)' }}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Available reward tiers */}
      {card.availableRewardTiers && card.availableRewardTiers.length > 0 && (
        <section>
          <SectionHeader icon={<Gift size={15} />} title="Reward Tiers" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {card.availableRewardTiers.map((tier) => (
              <div key={tier.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{tier.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    Threshold: {tier.threshold} · Value: {tier.value}
                    {tier.usageLimit > 0 ? ` · Limit: ${tier.usageLimit}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom fields */}
      {activeCustomFields.length > 0 && (
        <section>
          <SectionHeader icon={<Tag size={15} />} title="Custom Fields" />
          <div style={{ ...cardStyle, marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            {activeCustomFields.map((f) => (
              <InfoRow key={f.id} label={f.name} value={f.value} />
            ))}
          </div>
        </section>
      )}

      {/* Card links */}
      {(card.installLink || card.shareLink) && (
        <section>
          <SectionHeader icon={<ExternalLink size={15} />} title="Card Links" />
          <div style={{ ...cardStyle, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {card.installLink && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>Install Link</div>
                <CopyField value={card.installLink} />
              </div>
            )}
            {card.shareLink && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>Share Link</div>
                <CopyField value={card.shareLink} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Cardholder */}
      {card.customer && (
        <section>
          <SectionHeader icon={<User size={15} />} title="Cardholder" />
          <div
            style={{ ...cardStyle, cursor: 'pointer', marginTop: 10 }}
            onClick={() => navigate(`/clients/${card.customer!.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/clients/${card.customer!.id}`)}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface)')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              <InfoRow
                label="Name"
                value={[card.customer.firstName, card.customer.lastName].filter(Boolean).join(' ') || '—'}
              />
              <InfoRow label="Phone" value={card.customer.phone ? <CopyField value={card.customer.phone} /> : '—'} />
              <InfoRow label="Email" value={card.customer.email || '—'} />
              {card.customer.dateOfBirth && (
                <InfoRow label="Date of Birth" value={formatDate(card.customer.dateOfBirth)} />
              )}
              {card.customer.gender != null && (
                <InfoRow label="Gender" value={GENDER_LABELS[card.customer.gender] ?? '—'} />
              )}
              <InfoRow label="Customer ID" value={<CopyField value={card.customer.id} />} />
            </div>
          </div>
        </section>
      )}

      {/* Operations */}
      <section>
        <SectionHeader icon={<Activity size={15} />} title="Operations" />
        {!operations || operations.length === 0 ? (
          <EmptyState icon={<Activity size={20} />} title="No operations" message="Stamp and reward history will appear here." />
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
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: op.value > 0 ? 'var(--success)' : 'var(--warning)', marginTop: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{op.type.replace(/_/g, ' ')}</div>
                  {op.comment && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{op.comment}</div>}
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

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{label}</div>
      <div style={{ fontWeight: 700, fontSize: 22, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>{value}</div>
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
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

const inputLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--text-faint)',
  marginBottom: 4,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
}

const inputStyle: React.CSSProperties = {
  background: 'var(--surface-2)',
  border: '1px solid var(--bdr)',
  borderRadius: 8,
  padding: '6px 10px',
  fontSize: 13,
  color: 'var(--text)',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

const actionBtnStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 8,
  padding: '7px 16px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  opacity: 1,
}
