import { useState, useRef, useEffect } from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  type DragEndEvent,
  type DragOverEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import { useColumns } from '../hooks/useColumns'
import { useCreateColumn } from '../hooks/useCreateColumn'
import { useUpdateCard } from '../hooks/useUpdateCard'
import Column from './Column'

interface Props {
  showAddColumn: boolean
  onCloseAddColumn: () => void
}

// pointerWithin を優先し、pointer が droppable 外のとき rectIntersection にフォールバック
function collisionDetection(args: Parameters<typeof pointerWithin>[0]) {
  const pointerCollisions = pointerWithin(args)
  return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args)
}

export default function Board({ showAddColumn, onCloseAddColumn }: Props) {
  const { data, isLoading, isError } = useColumns()
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutate, isPending } = useCreateColumn()
  const { mutate: updateCard } = useUpdateCard()

  // onDragOver で確定した移動先を保持する ref
  const pendingMove = useRef<{
    cardId: number
    targetColumnId: number
    targetPosition: number
  } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  useEffect(() => {
    if (showAddColumn) {
      setTitle('')
      inputRef.current?.focus()
    }
  }, [showAddColumn])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    mutate({ title: trimmed }, { onSuccess: () => onCloseAddColumn() })
  }

  function resolveTarget(overId: UniqueIdentifier) {
    const allColumns = data ?? []
    const overIdStr = String(overId)

    if (overIdStr.startsWith('column-')) {
      const targetColumnId = Number(overIdStr.replace('column-', ''))
      const targetCol = allColumns.find(c => c.id === targetColumnId)
      return {
        targetColumnId,
        targetPosition: (targetCol?.cards.length ?? 0) + 1,
      }
    }

    // over は別カードの id
    const overCardId = overId as number
    const targetCol = allColumns.find(c => c.cards.some(c => c.id === overCardId))
    if (!targetCol) return null
    const sortedCards = [...targetCol.cards].sort((a, b) => a.position - b.position)
    const overIndex = sortedCards.findIndex(c => c.id === overCardId)
    return {
      targetColumnId: targetCol.id,
      targetPosition: overIndex + 1,
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) {
      pendingMove.current = null
      return
    }

    const overId = getFirstCollision([{ id: over.id }], 'id') as UniqueIdentifier ?? over.id
    const resolved = resolveTarget(overId)
    if (!resolved) {
      pendingMove.current = null
      return
    }

    pendingMove.current = {
      cardId: active.id as number,
      ...resolved,
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active } = event
    const move = pendingMove.current
    pendingMove.current = null

    if (!move || move.cardId !== (active.id as number)) return

    const allColumns = data ?? []
    const sourceCol = allColumns.find(c => c.cards.some(c => c.id === move.cardId))
    if (!sourceCol) return

    if (sourceCol.id === move.targetColumnId) {
      // 同一カラム内の並び替え
      const currentCard = sourceCol.cards.find(c => c.id === move.cardId)
      if (currentCard?.position === move.targetPosition) return
      updateCard({ id: move.cardId, req: { position: move.targetPosition } })
    } else {
      // カラム間移動
      updateCard({
        id: move.cardId,
        req: { column_id: move.targetColumnId, position: move.targetPosition },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-white text-sm">
        読み込み中…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-300 text-sm">
        データの取得に失敗しました。バックエンドが起動しているか確認してください。
      </div>
    )
  }

  const sorted = [...(data ?? [])].sort((a, b) => a.position - b.position)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <main className="flex-1 overflow-x-auto">
        <div className="flex items-start gap-4 p-5 min-w-max">
          {sorted.map(col => (
            <Column key={col.id} column={col} />
          ))}

          {showAddColumn && (
            <div className="bg-col-bg rounded-md w-[280px] min-w-[280px] p-2.5">
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                  ref={inputRef}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="カラム名を入力"
                  className="w-full border border-[#b0b8c8] rounded px-2 py-1.5 text-sm
                             text-col-title placeholder-meta-text focus:outline-none
                             focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]"
                />
                <div className="flex gap-1.5">
                  <button
                    type="submit"
                    disabled={isPending || !title.trim()}
                    className="bg-[#0052cc] hover:bg-[#0047b3] disabled:opacity-50
                               text-white text-sm font-semibold px-3 py-1 rounded
                               transition-colors"
                  >
                    {isPending ? '追加中…' : 'カラムを追加'}
                  </button>
                  <button
                    type="button"
                    onClick={onCloseAddColumn}
                    className="text-meta-text hover:bg-[#cdd0d6] hover:text-col-title
                               text-sm px-2 py-1 rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </DndContext>
  )
}
