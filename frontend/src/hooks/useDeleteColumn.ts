import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteColumn } from '../api/client'

export function useDeleteColumn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteColumn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns'] })
    },
  })
}
