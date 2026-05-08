import { useRef, useState, useEffect } from 'react'

const CORRECT_PIN = '7777'
const PIN_LENGTH = 4

interface PinLockProps {
  onUnlock: () => void
}

export default function PinLock({ onUnlock }: PinLockProps) {
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(''))
  const [shake, setShake] = useState(false)
  const [error, setError] = useState(false)
  const ref0 = useRef<HTMLInputElement>(null)
  const ref1 = useRef<HTMLInputElement>(null)
  const ref2 = useRef<HTMLInputElement>(null)
  const ref3 = useRef<HTMLInputElement>(null)
  const refs = [ref0, ref1, ref2, ref3]

  useEffect(() => {
    refs[0].current?.focus()
  }, [])

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    setDigits(next)
    setError(false)

    if (digit && index < PIN_LENGTH - 1) {
      refs[index + 1].current?.focus()
    }

    if (digit && index === PIN_LENGTH - 1) {
      const pin = [...next].join('')
      if (next.every((d) => d !== '') && pin.length === PIN_LENGTH) {
        verify([...next])
      }
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits]
        next[index] = ''
        setDigits(next)
      } else if (index > 0) {
        refs[index - 1].current?.focus()
        const next = [...digits]
        next[index - 1] = ''
        setDigits(next)
      }
    }
  }

  function verify(ds: string[]) {
    const pin = ds.join('')
    if (pin === CORRECT_PIN) {
      onUnlock()
    } else {
      setShake(true)
      setError(true)
      setTimeout(() => {
        setShake(false)
        setDigits(Array(PIN_LENGTH).fill(''))
        refs[0].current?.focus()
      }, 600)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        gap: 32,
      }}
    >
      {/* Logo mark */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C9.24 2 7 4.24 7 7c0 1.41.52 2.7 1.38 3.67C5.84 11.69 4 14.16 4 17c0 .55.45 1 1 1h14c.55 0 1-.45 1-1 0-2.84-1.84-5.31-4.38-6.33C16.48 9.7 17 8.41 17 7c0-2.76-2.24-5-5-5z"
              fill="rgba(255,240,210,0.9)"
            />
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Loyalty Dashboard</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Enter your PIN to continue</div>
        </div>
      </div>

      {/* PIN boxes */}
      <div
        style={{
          display: 'flex',
          gap: 14,
          animation: shake ? 'pin-shake 0.55s ease' : 'none',
        }}
      >
        {digits.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={d ? '•' : ''}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            style={{
              width: 58,
              height: 64,
              borderRadius: 14,
              border: `2px solid ${error ? 'var(--error, #c0392b)' : d ? 'var(--primary)' : 'var(--bdr)'}`,
              background: 'var(--surface)',
              fontSize: 28,
              fontWeight: 700,
              textAlign: 'center',
              color: 'var(--text)',
              outline: 'none',
              caretColor: 'transparent',
              transition: 'border-color 0.15s',
              boxShadow: d && !error ? '0 0 0 3px rgba(122,74,30,0.10)' : 'none',
            }}
          />
        ))}
      </div>

      {error && (
        <div style={{ fontSize: 13, color: 'var(--error, #c0392b)', fontWeight: 500, marginTop: -16 }}>
          Incorrect PIN. Try again.
        </div>
      )}
    </div>
  )
}
