import { boomerangClient } from './client'
import type { Customer, CreateCustomerPayload } from '../../types/boomerang'

export const customersService = {
  getAll: (signal?: AbortSignal) =>
    boomerangClient.get<Customer[]>('/api/v2/customers', signal),

  getById: (customerId: string, signal?: AbortSignal) =>
    boomerangClient.get<Customer>(`/api/v2/customers/${customerId}`, signal),

  getByPhone: (phone: string, signal?: AbortSignal) =>
    boomerangClient.get<Customer>(`/api/v2/customers/phone/${encodeURIComponent(phone)}`, signal),

  create: (payload: CreateCustomerPayload) =>
    boomerangClient.post<Customer>('/api/v2/customers', payload),

  update: (customerId: string, payload: Partial<Customer>) =>
    boomerangClient.patch<Customer>(`/api/v2/customers/${customerId}`, payload),

  delete: (customerId: string) =>
    boomerangClient.delete<void>(`/api/v2/customers/${customerId}`),
}
