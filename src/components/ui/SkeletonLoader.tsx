interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: number
  className?: string
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 6, className = '' }: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--surface-offset) 50%, var(--surface-2) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s ease infinite',
      }}
      aria-hidden="true"
    />
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: 16,
            padding: '14px 16px',
            borderBottom: '1px solid var(--bdr)',
          }}
        >
          <Skeleton height={14} />
          <Skeleton height={14} />
          <Skeleton height={14} width="70%" />
          <Skeleton height={14} width="60%" />
          <Skeleton height={14} width="50%" />
        </div>
      ))}
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div style={{ padding: 20, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--bdr)' }}>
      <Skeleton height={12} width={80} />
      <div style={{ marginTop: 12 }}>
        <Skeleton height={28} width={60} />
      </div>
    </div>
  )
}

// Inject the shimmer keyframe once
if (typeof document !== 'undefined' && !document.getElementById('skeleton-style')) {
  const style = document.createElement('style')
  style.id = 'skeleton-style'
  style.textContent = `@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`
  document.head.appendChild(style)
}
