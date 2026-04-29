import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCard } from '../api/client'

export function useDeleteCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns'] })
    },
  })
}
