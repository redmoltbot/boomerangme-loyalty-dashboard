import { useState } from 'react'
import { useCustomers } from './useCustomers'
import { useCards } from './useCards'
import type { Card, Customer } from '../types/boomerang'

type LookupMode = 'existence' | 'card' | 'customer'

interface LookupState {
  loading: boolean
  error: string | null
  found: boolean | null
  card: Card | null
  customer: Customer | null
  isRateLimit: boolean
}

// Strip non-digits and match: exact, or one is a suffix of the other (handles +65 prefix)
function phonesMatch(stored: string, input: string): boolean {
  const s = stored.replace(/\D/g, '')
  const i = input.replace(/\D/g, '')
  if (!s || !i || i.length < 4) return false
  return s === i || s.endsWith(i) || i.endsWith(s)
}

const INITIAL: LookupState = {
  loading: false, error: null, found: null, card: null, customer: null, isRateLimit: false,
}

export function usePhoneLookup() {
  const { data: allCustomers, isLoading: customersLoading } = useCustomers()
  const { data: allCards, isLoading: cardsLoading } = useCards()
  const dataLoading = customersLoading || cardsLoading

  const [state, setState] = useState<LookupState>(INITIAL)

  function lookup(phone: string, mode: LookupMode) {
    setState({ ...INITIAL, loading: true })

    const customer = (allCustomers ?? []).find(
      (c) => c.phone != null && phonesMatch(c.phone, phone),
    )

    if (mode === 'customer') {
      setState({ ...INITIAL, found: !!customer, customer: customer ?? null })
      return
    }

    if (!customer) {
      setState({ ...INITIAL, found: false })
      return
    }

    const card = (allCards ?? []).find((c) => c.customerId === customer.id)
    setState({ ...INITIAL, found: !!card, card: card ?? null })
  }

  function reset() {
    setState(INITIAL)
  }

  return { ...state, lookup, reset, dataLoading }
}
