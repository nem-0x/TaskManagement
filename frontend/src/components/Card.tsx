import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { CardResponse } from '../types/api'
import CardEditModal from './CardEditModal'

interface Props {
  card: CardResponse
}

const PRIORITY_BORDER: Record<string, string> = {
  high:   'border-l-priority-high',
  medium: 'border-l-priority-medium',
  low:    'border-l-priority-low',
}

const PRIORITY_BADGE_BG: Record<string, string> = {
  high:   'bg-priority-high',
  medium: 'bg-priority-medium',
  low:    'bg-priority-low',
}

const PRIORITY_LABEL: Record<string, string> = {
  high: '高', medium: '中', low: '低',
}

function getDueDateStatus(dueDate: string): 'overdue' | 'due-soon' | 'normal' {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  if (due < today) return 'overdue'
  const diffDays = (due.getTime() - today.getTime()) / 86_400_000
  if (diffDays <= 3) return 'due-soon'
  return 'normal'
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${y}/${m}/${d}`
}

export default function Card({ card }: Props) {
  const [editOpen, setEditOpen] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { columnId: card.column_id } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const borderClass = card.priority ? PRIORITY_BORDER[card.priority] : 'border-l-transparent'

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setEditOpen(true)}
        className={`bg-white rounded shadow-sm px-2.5 py-2 border-l-4 ${borderClass}
                    hover:shadow-md transition-shadow cursor-pointer`}
      >
        <div className="flex items-start gap-1.5">
          <div className="flex-1 min-w-0">
            <p className="break-words leading-snug text-col-title text-sm">
              {card.title}
            </p>
            {(card.priority || card.due_date) && (
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                {card.priority && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white
                                 ${PRIORITY_BADGE_BG[card.priority]}`}
                  >
                    {PRIORITY_LABEL[card.priority]}
                  </span>
                )}
                {card.due_date && (() => {
                  const status = getDueDateStatus(card.due_date)
                  const colorClass =
                    status === 'overdue'  ? 'text-due-overdue font-semibold' :
                    status === 'due-soon' ? 'text-due-soon font-semibold'    :
                    'text-meta-text'
                  return (
                    <span className={`text-[11px] flex items-center gap-0.5 ${colorClass}`}>
                      📅 {formatDate(card.due_date)}
                      {status === 'overdue' && ' 期限切れ'}
                    </span>
                  )
                })()}
              </div>
            )}
          </div>
          <button
            className="text-[#97a0af] hover:text-priority-high text-sm leading-none
                       px-0.5 rounded flex-shrink-0 transition-colors self-start"
            title="カードを削除"
            onClick={e => e.stopPropagation()}
          >
            ×
          </button>
        </div>
      </div>

      {editOpen && (
        <CardEditModal card={card} onClose={() => setEditOpen(false)} />
      )}
    </>
  )
}
