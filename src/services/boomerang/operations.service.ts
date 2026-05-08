import { boomerangClient } from './client'
import type { Operation } from '../../types/boomerang'

export const operationsService = {
  getAll: (
    params?: { cardNumber?: string; customerId?: string; limit?: number },
    signal?: AbortSignal
  ) => {
    const qs = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : ''
    return boomerangClient.get<Operation[]>(`/api/v2/operations${qs}`, signal)
  },
}
