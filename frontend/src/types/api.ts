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
  created_at: string
  updated_at: string
  cards: CardResponse[]
}
