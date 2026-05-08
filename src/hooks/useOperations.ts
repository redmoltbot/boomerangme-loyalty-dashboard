import { useQuery } from '@tanstack/react-query'
import { operationsService } from '../services/boomerang/operations.service'

export function useOperations(params?: { cardNumber?: string; customerId?: string; limit?: number }) {
  return useQuery({
    queryKey: ['operations', params],
    queryFn: ({ signal }) => operationsService.getAll(params, signal),
    staleTime: 15_000,
  })
}
