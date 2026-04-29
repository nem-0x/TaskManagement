import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCard } from '../api/client'
import type { UpdateCardRequest } from '../types/api'

export function useUpdateCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, req }: { id: number; req: UpdateCardRequest }) =>
      updateCard(id, req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns'] })
    },
  })
}
