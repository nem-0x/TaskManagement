import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { ColumnResponse } from '../types/api'
import { useUpdateCard } from '../hooks/useUpdateCard'
import { useDeleteColumn } from '../hooks/useDeleteColumn'
import DeleteConfirmModal from './DeleteConfirmModal'
import CardCreateModal from './CardCreateModal'
import Card from './Card'

interface Props {
  column: ColumnResponse
}

export default function Column({ column }: Props) {
  const sorted = [...column.cards].sort((a, b) => a.position - b.position)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { mutate: updateCard } = useUpdateCard()
  const { mutate: deleteColumn, isPending: isDeleting } = useDeleteColumn()

  const { setNodeRef } = useDroppable({ id: `column-${column.id}` })

  function handleSortByPriority() {
    const ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }
    const reSorted = [...sorted].sort((a, b) => {
      const pa = a.priority ? ORDER[a.priority] : 3
      const pb = b.priority ? ORDER[b.priority] : 3
      return pa - pb
    })
    reSorted.forEach((card, idx) => {
      if (card.position !== idx + 1) {
        updateCard({ id: card.id, req: { position: idx + 1 } })
      }
    })
  }

  function handleSortByDueDate() {
    const reSorted = [...sorted].sort((a, b) => {
      if (!a.due_date && !b.due_date) return 0
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return a.due_date.localeCompare(b.due_date)
    })
    reSorted.forEach((card, idx) => {
      if (card.position !== idx + 1) {
        updateCard({ id: card.id, req: { position: idx + 1 } })
      }
    })
  }

  return (
    <div className="bg-col-bg rounded-md w-[280px] min-w-[280px] flex flex-col max-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="px-3 pt-2.5 pb-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-sm text-col-title flex-1 rounded px-1 py-0.5">
            {column.title}
          </span>
          {!column.is_default && (
            <button
              className="text-meta-text hover:bg-[#c1c7d0] hover:text-col-title
                         text-base leading-none px-1 py-0.5 rounded transition-colors"
              title="カラムを削除"
              onClick={() => setDeleteOpen(true)}
            >
              ×
            </button>
          )}
        </div>
        {/* Sort bar */}
        <div className="flex gap-1 pb-1">
          <button
            onClick={handleSortByPriority}
            className="border border-[#b0b8c8] text-meta-text rounded px-2 py-0.5 text-[11px]
                       hover:bg-[#d5d9e0] hover:text-col-title hover:border-[#8993a4] transition-colors"
          >
            ↑ 優先度順
          </button>
          <button
            onClick={handleSortByDueDate}
            className="border border-[#b0b8c8] text-meta-text rounded px-2 py-0.5 text-[11px]
                       hover:bg-[#d5d9e0] hover:text-col-title hover:border-[#8993a4] transition-colors"
          >
            ↑ 期限順
          </button>
        </div>
      </div>

      {/* Card list */}
      <div ref={setNodeRef} className="px-2 py-1 flex flex-col gap-1.5 overflow-y-auto flex-1">
        <SortableContext
          items={sorted.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {sorted.map(card => (
            <Card key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      {/* Add card button */}
      <div className="px-2 pb-2 pt-1.5">
        <button
          onClick={() => setCreateOpen(true)}
          className="w-full bg-transparent text-left px-2 py-1.5 rounded text-sm text-meta-text
                     hover:bg-[#cdd0d6] hover:text-col-title transition-colors"
        >
          + カード追加
        </button>
      </div>

      {createOpen && (
        <CardCreateModal
          columnId={column.id}
          onClose={() => setCreateOpen(false)}
        />
      )}

      {deleteOpen && (
        <DeleteConfirmModal
          message={`「${column.title}」とその中のカードをすべて削除しますか？この操作は取り消せません。`}
          onConfirm={() => deleteColumn(column.id, { onSuccess: () => setDeleteOpen(false) })}
          onCancel={() => setDeleteOpen(false)}
          isPending={isDeleting}
        />
      )}
    </div>
  )
}
