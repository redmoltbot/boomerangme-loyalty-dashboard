interface StampProgressProps {
  stamps: number
  maxStamps: number
  size?: 'sm' | 'md' | 'lg'
}

export function StampProgress({ stamps, maxStamps, size = 'md' }: StampProgressProps) {
  const total = maxStamps || 10
  const filled = Math.min(stamps, total)

  const dotSize = size === 'sm' ? 20 : size === 'lg' ? 40 : 30
  const gap = size === 'sm' ? 4 : size === 'lg' ? 8 : 6

  return (
    <div
      role="img"
      aria-label={`${filled} of ${total} stamps collected`}
      style={{ display: 'flex', flexWrap: 'wrap', gap, maxWidth: (dotSize + gap) * 5 }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: i < filled ? 'var(--accent)' : 'var(--surface-2)',
            border: i < filled ? '2px solid rgba(200,150,26,0.3)' : '2px dashed var(--bdr)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.2s, border-color 0.2s',
          }}
        >
          {i < filled && size !== 'sm' && (
            <svg width={size === 'lg' ? 18 : 13} height={size === 'lg' ? 18 : 13} viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill="white" opacity={0.9} />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}

interface StampBarProps {
  stamps: number
  maxStamps: number
}

export function StampBar({ stamps, maxStamps }: StampBarProps) {
  const pct = maxStamps > 0 ? Math.min((stamps / maxStamps) * 100, 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 80 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          borderRadius: 3,
          background: 'var(--surface-2)',
          overflow: 'hidden',
        }}
        role="progressbar"
        aria-valuenow={stamps}
        aria-valuemin={0}
        aria-valuemax={maxStamps}
        aria-label={`${stamps}/${maxStamps} stamps`}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: 'var(--accent)',
            borderRadius: 3,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
        {stamps}/{maxStamps}
      </span>
    </div>
  )
}
