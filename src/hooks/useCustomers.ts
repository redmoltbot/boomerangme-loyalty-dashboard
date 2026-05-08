import { useQuery } from '@tanstack/react-query'
import { customersService } from '../services/boomerang/customers.service'

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: ({ signal }) => customersService.getAll(signal),
    staleTime: 30_000,
  })
}

export function useCustomer(customerId: string) {
  return useQuery({
    queryKey: ['customers', customerId],
    queryFn: ({ signal }) => customersService.getById(customerId, signal),
    enabled: !!customerId,
    staleTime: 15_000,
  })
}
