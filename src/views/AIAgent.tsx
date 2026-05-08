import { Bot, ExternalLink } from 'lucide-react'

const TELEGRAM_URL = 'https://web.telegram.org/a/#8523635522'

export default function AIAgent() {
  return (
    <div style={{ maxWidth: 540, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>AI Agent</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
          Your Telegram AI agent manages this digital reward program.
        </p>
      </div>

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--bdr)',
          borderRadius: 16,
          padding: '32px 24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: 'rgba(37,161,220,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bot size={32} style={{ color: '#25a1dc' }} />
        </div>

        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
            Reward Program AI Agent
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 340 }}>
            Chat with your AI agent on Telegram to manage customers, issue stamps, check balances, and more — hands-free.
          </div>
        </div>

        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#25a1dc',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            padding: '12px 28px',
            borderRadius: 12,
            textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Open in Telegram
          <ExternalLink size={15} />
        </a>
      </div>
    </div>
  )
}
