import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createColumn } from '../api/client'
import type { CreateColumnRequest } from '../types/api'

export function useCreateColumn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (req: CreateColumnRequest) => createColumn(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns'] })
    },
  })
}
