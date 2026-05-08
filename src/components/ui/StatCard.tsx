import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  accent?: boolean
  sub?: string
}

export function StatCard({ label, value, icon, accent, sub }: StatCardProps) {
  return (
    <div
      style={{
        padding: '20px 22px',
        borderRadius: 14,
        background: accent ? 'var(--primary)' : 'var(--surface)',
        border: '1px solid var(--bdr)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: accent ? 'rgba(255,240,210,0.8)' : 'var(--text-muted)',
          }}
        >
          {label}
        </span>
        {icon && (
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: accent ? 'rgba(255,255,255,0.15)' : 'var(--surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accent ? 'rgba(255,240,210,0.9)' : 'var(--text-muted)',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: accent ? '#fff' : 'var(--text)',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {sub && (
          <span style={{ fontSize: 12, color: accent ? 'rgba(255,240,210,0.7)' : 'var(--text-faint)' }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  )
}
