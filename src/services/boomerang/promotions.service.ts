import { boomerangClient } from './client'
import type { Promotion, CreatePromotionPayload } from '../../types/boomerang'

export const promotionsService = {
  getAll: (
    params?: { templateId?: string; active?: boolean },
    signal?: AbortSignal
  ) => {
    const qs = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : ''
    return boomerangClient.get<Promotion[]>(`/api/v2/promotions${qs}`, signal)
  },

  getById: (id: string, signal?: AbortSignal) =>
    boomerangClient.get<Promotion>(`/api/v2/promotions/${id}`, signal),

  create: (payload: CreatePromotionPayload) =>
    boomerangClient.post<Promotion>('/api/v2/promotions', payload),

  update: (id: string, payload: Partial<Promotion>) =>
    boomerangClient.patch<Promotion>(`/api/v2/promotions/${id}`, payload),

  delete: (id: string) =>
    boomerangClient.delete<void>(`/api/v2/promotions/${id}`),
}
