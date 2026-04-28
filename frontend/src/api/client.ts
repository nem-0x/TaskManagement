import axios from 'axios'
import type { ColumnResponse } from '../types/api'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
})

export async function fetchColumns(): Promise<ColumnResponse[]> {
  const { data } = await apiClient.get<ColumnResponse[]>('/api/columns')
  return data
}

export default apiClient
