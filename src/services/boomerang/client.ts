import { BOOMERANG_CONFIG } from '../../config/boomerang'

const MAX_RETRIES = 3
const RATE_LIMIT_DELAY = 1000

// Token-bucket rate limiter: 10 req/s
let tokens = 10
let lastRefill = Date.now()

function refillTokens() {
  const now = Date.now()
  const elapsed = (now - lastRefill) / 1000
  tokens = Math.min(10, tokens + elapsed * BOOMERANG_CONFIG.rateLimit.requestsPerSecond)
  lastRefill = now
}

async function acquireToken(): Promise<void> {
  refillTokens()
  if (tokens >= 1) {
    tokens -= 1
    return
  }
  const wait = ((1 - tokens) / BOOMERANG_CONFIG.rateLimit.requestsPerSecond) * 1000
  await new Promise((r) => setTimeout(r, wait))
  tokens = 0
}

async function rateLimitedFetch(
  url: string,
  options: RequestInit,
  retries = 0
): Promise<Response> {
  await acquireToken()

  const res = await fetch(url, options)

  if (res.status === 429 && retries < MAX_RETRIES) {
    await new Promise((r) => setTimeout(r, RATE_LIMIT_DELAY * (retries + 1)))
    return rateLimitedFetch(url, options, retries + 1)
  }

  return res
}

const headers = () => ({
  'Content-Type': 'application/json',
})

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const res = await rateLimitedFetch(`${BOOMERANG_CONFIG.baseUrl}${url}`, {
    ...options,
    headers: headers(),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    const err = new Error(text || `HTTP ${res.status}`) as Error & {
      status: number
      isRateLimit: boolean
    }
    err.status = res.status
    err.isRateLimit = res.status === 429
    throw err
  }

  const text = await res.text()
  return text ? JSON.parse(text) : ({} as T)
}

export const boomerangClient = {
  get: <T>(path: string, signal?: AbortSignal) =>
    request<T>(path, { signal }),

  post: <T>(path: string, body: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), signal }),

  patch: <T>(path: string, body: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body), signal }),

  delete: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, {
      method: 'DELETE',
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal,
    }),
}
