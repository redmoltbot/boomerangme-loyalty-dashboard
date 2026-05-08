import { useCustomers } from './useCustomers'
import type { Customer } from '../types/boomerang'

export function useCustomerSearch() {
  const { data: allCustomers, isLoading, isError } = useCustomers()

  function searchByName(query: string): Customer[] {
    const q = query.trim().toLowerCase()
    if (q.length < 2 || !allCustomers) return []
    return allCustomers.filter((c) => {
      const full = `${c.firstName ?? ''} ${c.lastName ?? ''}`.toLowerCase()
      return (
        full.includes(q) ||
        (c.firstName ?? '').toLowerCase().includes(q) ||
        (c.lastName ?? '').toLowerCase().includes(q)
      )
    })
  }

  function searchByEmail(query: string): Customer[] {
    const q = query.trim().toLowerCase()
    if (q.length < 2 || !allCustomers) return []
    return allCustomers.filter((c) => c.email?.toLowerCase().includes(q))
  }

  return { searchByName, searchByEmail, isLoading, isError }
}
