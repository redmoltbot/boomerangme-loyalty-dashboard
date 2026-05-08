import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyFieldProps {
  value: string
  label?: string
  className?: string
}

export function CopyField({ value, label, className = '' }: CopyFieldProps) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <span className={`inline-flex items-center gap-1 group ${className}`}>
      {label && <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{label}</span>}
      <span
        style={{
          fontFamily: 'ui-monospace, monospace',
          fontSize: 13,
          color: 'var(--text)',
          background: 'var(--surface-2)',
          padding: '2px 8px',
          borderRadius: 6,
          border: '1px solid var(--bdr)',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          transition: 'background 0.15s',
          userSelect: 'all',
        }}
        onClick={copy}
        title="Click to copy"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && copy()}
        aria-label={`Copy ${value}`}
      >
        {value}
        <span style={{ color: 'var(--text-faint)', flexShrink: 0 }}>
          {copied ? <Check size={12} style={{ color: 'var(--success)' }} /> : <Copy size={12} />}
        </span>
      </span>
    </span>
  )
}
