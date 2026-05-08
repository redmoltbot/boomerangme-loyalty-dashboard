import { useState, useEffect } from 'react'
import { boomerangClient } from '../../services/boomerang/client'

type Health = 'checking' | 'ok' | 'error'

export function ApiHealthIndicator() {
  const [health, setHealth] = useState<Health>('checking')

  useEffect(() => {
    let mounted = true
    const ctrl = new AbortController()

    boomerangClient
      .get<unknown>('/api/v2/templates', ctrl.signal)
      .then(() => { if (mounted) setHealth('ok') })
      .catch(() => { if (mounted) setHealth('error') })

    return () => {
      mounted = false
      ctrl.abort()
    }
  }, [])

  const dot = {
    checking: { color: '#b5a48e', label: 'Checking API…' },
    ok: { color: '#4a7c3f', label: 'API connected' },
    error: { color: '#9b2c3a', label: 'API unreachable' },
  }[health]

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 0' }}
      title={dot.label}
      aria-label={dot.label}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: dot.color,
          flexShrink: 0,
          animation: health === 'checking' ? 'pulse-dot 1.2s ease-in-out infinite' : undefined,
        }}
      />
      <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{dot.label}</span>
    </div>
  )
}
