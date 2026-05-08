import { boomerangClient } from './client'
import type { Template } from '../../types/boomerang'

export const templatesService = {
  getAll: (signal?: AbortSignal) =>
    boomerangClient.get<Template[]>('/api/v2/templates', signal),

  getById: (templateId: string, signal?: AbortSignal) =>
    boomerangClient.get<Template>(`/api/v2/templates/${templateId}`, signal),
}
