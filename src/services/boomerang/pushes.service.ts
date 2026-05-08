import { boomerangClient } from './client'
import type { SendPushPayload } from '../../types/boomerang'

interface Push {
  id: string
  templateId: number
  title: string
  message: string
  url?: string
  createdAt: string
}

export const pushesService = {
  getAll: (signal?: AbortSignal) =>
    boomerangClient.get<Push[]>('/api/v2/pushes', signal),

  getById: (pushId: string, signal?: AbortSignal) =>
    boomerangClient.get<Push>(`/api/v2/pushes/${pushId}`, signal),

  send: (payload: SendPushPayload) =>
    boomerangClient.post<Push>('/api/v2/pushes', payload),
}
