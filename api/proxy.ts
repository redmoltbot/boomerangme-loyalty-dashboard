import type { VercelRequest, VercelResponse } from '@vercel/node'

const BASE_URL = process.env.BOOMERANG_BASE_URL ?? 'https://api.digitalwallet.cards'
const API_KEY = process.env.BOOMERANG_API_KEY ?? ''

type Rec = Record<string, unknown>

const CARD_TYPE_MAP: Record<string, number> = {
  stamp: 0, cashback: 1, multipass: 2, coupon: 3,
  discount: 4, gift: 5, membership: 6, reward: 7,
}

const CARD_STATUS_MAP: Record<string, string> = {
  active: 'active',
  not_installed: 'inactive',
  inactive: 'inactive',
  expired: 'expired',
}

// eventId → human-readable type label used in the operations list
const EVENT_LABEL: Record<number, string> = {
  1: 'stamp_added',
  2: 'stamp_added',
  3: 'bonus_stamps_added',
  4: 'purchase_recorded',
  5: 'points_added',
  6: 'amount_added',
  7: 'visit_recorded',
  42: 'reward_redeemed',
  43: 'coupon_redeemed',
}

function transformCustomer(raw: Rec): Rec {
  return { ...raw, lastName: raw.surname }
}

function transformCard(raw: Rec): Rec {
  const balance = (raw.balance as Rec | null) ?? {}
  return {
    ...raw,
    number: raw.id,
    cardType: CARD_TYPE_MAP[raw.type as string] ?? 0,
    stamps: (balance.currentNumberOfUses as number | null) ?? 0,
    maxStamps: (balance.stampsBeforeReward as number | null) ?? 10,
    rewards: (balance.numberRewardsUnused as number | null) ?? 0,
    status: CARD_STATUS_MAP[raw.status as string] ?? 'inactive',
    customer: raw.customer ? transformCustomer(raw.customer as Rec) : undefined,
  }
}

function transformOperation(raw: Rec): Rec {
  const eventId = raw.eventId as number
  return {
    ...raw,
    cardNumber: raw.cardId,
    type: EVENT_LABEL[eventId] ?? `event_${eventId}`,
    value: (raw.amount as number) ?? 0,
  }
}

function applyTransform(path: string, payload: unknown): unknown {
  if (path.startsWith('v2/customers')) {
    if (Array.isArray(payload)) return payload.map((c) => transformCustomer(c as Rec))
    if (payload && typeof payload === 'object') return transformCustomer(payload as Rec)
  } else if (path.startsWith('v2/cards')) {
    if (Array.isArray(payload)) return payload.map((c) => transformCard(c as Rec))
    if (payload && typeof payload === 'object') return transformCard(payload as Rec)
  } else if (path.startsWith('v2/operations')) {
    if (Array.isArray(payload)) return payload.map((o) => transformOperation(o as Rec))
    if (payload && typeof payload === 'object') return transformOperation(payload as Rec)
  }
  return payload
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const boomerangPath = req.query.boomerangPath as string

  if (!boomerangPath) {
    res.status(400).json({ error: 'Missing boomerangPath' })
    return
  }

  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'boomerangPath') continue
    const values = Array.isArray(value) ? value : [value ?? '']
    values.forEach((v) => qs.append(key, v))
  }
  const qsStr = qs.toString() ? `?${qs.toString()}` : ''

  let upstream: Response
  try {
    upstream = await fetch(`${BASE_URL}/api/${boomerangPath}${qsStr}`, {
      method: req.method ?? 'GET',
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network error'
    res.status(502).json({ error: `Upstream unreachable: ${msg}` })
    return
  }

  let json: unknown
  try {
    json = await upstream.json()
  } catch {
    res.status(upstream.status).json({ error: `Upstream error (HTTP ${upstream.status})` })
    return
  }

  // Unwrap the Boomerang envelope: { code, meta, data: ... }
  const raw =
    json !== null && typeof json === 'object' && 'data' in (json as object)
      ? (json as { data: unknown }).data
      : json

  // Normalize field names to match frontend TypeScript types
  const payload = applyTransform(boomerangPath, raw)

  res.status(upstream.status).json(payload)
}
