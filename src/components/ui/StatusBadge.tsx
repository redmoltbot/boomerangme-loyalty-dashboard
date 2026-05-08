import { CARD_TYPE_LABELS, type CardType } from '../../types/boomerang'

interface CardTypeBadgeProps {
  cardType: CardType
}

const typeColors: Record<CardType, { bg: string; color: string }> = {
  0: { bg: 'rgba(200,150,26,0.15)', color: '#a07a10' },   // Stamp — gold
  1: { bg: 'rgba(74,124,63,0.15)', color: '#3a6432' },    // Cashback — herb
  2: { bg: 'rgba(122,74,30,0.12)', color: '#5e3615' },    // Multipass — crust
  3: { bg: 'rgba(155,44,58,0.12)', color: '#9b2c3a' },    // Coupon — berry
  4: { bg: 'rgba(192,94,30,0.12)', color: '#9a4012' },    // Discount — cinnamon
  5: { bg: 'rgba(120,90,160,0.12)', color: '#5a3a80' },   // Gift — purple
  6: { bg: 'rgba(40,120,180,0.12)', color: '#1a5080' },   // Membership — blue
  7: { bg: 'rgba(60,160,130,0.12)', color: '#1a6050' },   // Reward — teal
}

export function CardTypeBadge({ cardType }: CardTypeBadgeProps) {
  const { bg, color } = typeColors[cardType] ?? typeColors[0]
  return (
    <span
      style={{
        background: bg,
        color,
        fontSize: 12,
        fontWeight: 500,
        padding: '2px 10px',
        borderRadius: 20,
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      {CARD_TYPE_LABELS[cardType]}
    </span>
  )
}

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'expired'
}

const statusStyles: Record<string, { bg: string; color: string; dot: string }> = {
  active: { bg: 'rgba(74,124,63,0.12)', color: '#3a6432', dot: '#4a7c3f' },
  inactive: { bg: 'rgba(122,106,85,0.12)', color: '#7a6a55', dot: '#b5a48e' },
  expired: { bg: 'rgba(155,44,58,0.12)', color: '#9b2c3a', dot: '#9b2c3a' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const s = statusStyles[status] ?? statusStyles.inactive
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 12,
        fontWeight: 500,
        padding: '2px 10px 2px 7px',
        borderRadius: 20,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: s.dot,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
