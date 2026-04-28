import { useQuery } from '@tanstack/react-query'
import { fetchColumns } from '../api/client'

export function useColumns() {
  return useQuery({
    queryKey: ['columns'],
    queryFn: fetchColumns,
    staleTime: 30_000,
  })
}
