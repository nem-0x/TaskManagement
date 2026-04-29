import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCard } from '../api/client'
import type { CreateCardRequest } from '../types/api'

export function useCreateCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (req: CreateCardRequest) => createCard(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns'] })
    },
  })
}
