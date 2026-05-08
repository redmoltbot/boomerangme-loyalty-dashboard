import { boomerangClient } from './client'
import type { Card, CreateCardPayload } from '../../types/boomerang'

export const cardsService = {
  getAll: (signal?: AbortSignal) =>
    boomerangClient.get<Card[]>('/api/v2/cards', signal),

  getById: (cardNumber: string, signal?: AbortSignal) =>
    boomerangClient.get<Card>(`/api/v2/cards/${cardNumber}`, signal),

  create: (payload: CreateCardPayload) =>
    boomerangClient.post<Card>('/api/v2/cards', payload),

  delete: (cardNumber: string) =>
    boomerangClient.delete<void>(`/api/v2/cards/${cardNumber}`),

  checkByPhone: (phone: string, signal?: AbortSignal) =>
    boomerangClient.get<Card>(`/api/v2/cards/phone/${encodeURIComponent(phone)}`, signal),

  getInfoByPhone: (phone: string, signal?: AbortSignal) =>
    boomerangClient.get<Card>(`/api/v2/customers/phone/${encodeURIComponent(phone)}/card`, signal),

  addStamp: (cardNumber: string, stamps: number, comment?: string) =>
    boomerangClient.post<Card>(`/api/v2/cards/${cardNumber}/stamps`, { stamps, comment }),

  subtractStamp: (cardNumber: string, stamps: number, comment?: string) =>
    boomerangClient.delete<Card>(`/api/v2/cards/${cardNumber}/stamps`, { stamps, comment }),

  addReward: (cardNumber: string, rewards: number, comment?: string) =>
    boomerangClient.post<Card>(`/api/v2/cards/${cardNumber}/rewards`, { rewards, comment }),

  subtractReward: (cardNumber: string, rewards: number, purchaseSum: number, comment?: string) =>
    boomerangClient.delete<Card>(`/api/v2/cards/${cardNumber}/rewards`, { rewards, purchaseSum, comment }),

  addVisit: (cardNumber: string, visits: number, comment?: string) =>
    boomerangClient.post<Card>(`/api/v2/cards/${cardNumber}/visits`, { visits, comment }),

  addPurchase: (cardNumber: string, amount: number, comment?: string) =>
    boomerangClient.post<Card>(`/api/v2/cards/${cardNumber}/purchase`, { amount, comment }),

  addAmount: (cardNumber: string, amount: number, comment?: string) =>
    boomerangClient.post<Card>(`/api/v2/cards/${cardNumber}/amount`, { amount, comment }),

  subtractAmount: (cardNumber: string, amount: number, comment?: string) =>
    boomerangClient.delete<Card>(`/api/v2/cards/${cardNumber}/amount`, { amount, comment }),

  addPoints: (cardNumber: string, points: number, comment?: string) =>
    boomerangClient.post<Card>(`/api/v2/cards/${cardNumber}/points`, { points, comment }),

  subtractPoints: (cardNumber: string, points: number, comment?: string) =>
    boomerangClient.delete<Card>(`/api/v2/cards/${cardNumber}/points`, { points, comment }),

  addScores: (cardNumber: string, scores: number, comment?: string) =>
    boomerangClient.post<Card>(`/api/v2/cards/${cardNumber}/scores`, { scores, comment }),

  subtractScores: (cardNumber: string, scores: number, comment?: string) =>
    boomerangClient.delete<Card>(`/api/v2/cards/${cardNumber}/scores`, { scores, comment }),

  subtractVisit: (cardNumber: string, visits: number, comment?: string) =>
    boomerangClient.delete<Card>(`/api/v2/cards/${cardNumber}/visits`, { visits, comment }),

  receiveReward: (cardNumber: string, comment?: string) =>
    boomerangClient.post<Card>(`/api/v2/cards/${cardNumber}/receive-reward`, { comment }),

  redeemCoupon: (cardNumber: string, comment?: string) =>
    boomerangClient.post<Card>(`/api/v2/cards/${cardNumber}/redeem`, { comment }),

  addStampAction: (cardId: string, body: { stamps: number; comment?: string | null; purchaseSum?: number | null }) =>
    boomerangClient.post<Card>(`/api/v2/cards/${cardId}/add-stamp`, body),

  subtractStampAction: (cardId: string, body: { stamps: number; comment?: string | null; purchaseSum?: number | null }) =>
    boomerangClient.post<Card>(`/api/v2/cards/${cardId}/subtract-stamp`, body),
}
