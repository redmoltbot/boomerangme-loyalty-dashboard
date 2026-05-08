import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cardsService } from '../services/boomerang/cards.service'

export function useCards() {
  return useQuery({
    queryKey: ['cards'],
    queryFn: ({ signal }) => cardsService.getAll(signal),
    staleTime: 30_000,
  })
}

export function useCard(cardNumber: string) {
  return useQuery({
    queryKey: ['cards', cardNumber],
    queryFn: ({ signal }) => cardsService.getById(cardNumber, signal),
    enabled: !!cardNumber,
    staleTime: 15_000,
  })
}

type StampBody = { stamps: number; comment?: string | null; purchaseSum?: number | null }

export function useStampActions(cardNumber: string) {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['cards', cardNumber] })
    queryClient.invalidateQueries({ queryKey: ['operations'] })
  }

  const add = useMutation({
    mutationFn: (body: StampBody) => cardsService.addStampAction(cardNumber, body),
    onSuccess: invalidate,
  })

  const subtract = useMutation({
    mutationFn: (body: StampBody) => cardsService.subtractStampAction(cardNumber, body),
    onSuccess: invalidate,
  })

  return { add, subtract }
}
