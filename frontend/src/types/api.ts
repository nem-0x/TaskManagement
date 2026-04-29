export type Priority = 'high' | 'medium' | 'low'

const VALID_PRIORITIES: readonly string[] = ['high', 'medium', 'low']

export function toValidPriority(val: string): Priority | null {
  return VALID_PRIORITIES.includes(val) ? (val as Priority) : null
}

export interface CardResponse {
  id: number
  column_id: number
  title: string
  priority: 'high' | 'medium' | 'low' | null
  due_date: string | null
  position: number
  created_at: string
  updated_at: string
}

export interface ColumnResponse {
  id: number
  title: string
  position: number
  is_default: boolean
  created_at: string
  updated_at: string
  cards: CardResponse[]
}

export interface CreateCardRequest {
  column_id: number
  title: string
  priority?: Priority | null
  due_date?: string | null
}

export interface CreateColumnRequest {
  title: string
}

export interface UpdateCardRequest {
  title?: string
  priority?: 'high' | 'medium' | 'low' | null
  due_date?: string | null
  column_id?: number
  position?: number
}
