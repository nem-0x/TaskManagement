import axios from 'axios'
import type { CardResponse, ColumnResponse, CreateCardRequest, CreateColumnRequest } from '../types/api'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
})

export async function fetchColumns(): Promise<ColumnResponse[]> {
  const { data } = await apiClient.get<ColumnResponse[]>('/api/columns')
  return data
}

export async function createCard(req: CreateCardRequest): Promise<CardResponse> {
  const { data } = await apiClient.post<CardResponse>('/api/cards', req)
  return data
}

export async function createColumn(req: CreateColumnRequest): Promise<ColumnResponse> {
  const { data } = await apiClient.post<ColumnResponse>('/api/columns', req)
  return data
}

export default apiClient
