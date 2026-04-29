import { useState, useRef, useEffect } from 'react'
import type { ColumnResponse } from '../types/api'
import { useCreateCard } from '../hooks/useCreateCard'
import Card from './Card'

interface Props {
  column: ColumnResponse
}

export default function Column({ column }: Props) {
  const sorted = [...column.cards].sort((a, b) => a.position - b.position)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('')
  const [dueDate, setDueDate] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)

  const { mutate, isPending } = useCreateCard()

  useEffect(() => {
    if (showForm) titleRef.current?.focus()
  }, [showForm])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    mutate(
      {
        column_id: column.id,
        title: trimmed,
        ...(priority ? { priority: priority as 'high' | 'medium' | 'low' } : {}),
        ...(dueDate ? { due_date: dueDate } : {}),
      },
      {
        onSuccess: () => {
          setShowForm(false)
          setTitle('')
          setPriority('')
          setDueDate('')
        },
      }
    )
  }

  function handleCancel() {
    setShowForm(false)
    setTitle('')
    setPriority('')
    setDueDate('')
  }

  return (
    <div className="bg-col-bg rounded-md w-[280px] min-w-[280px] flex flex-col max-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="px-3 pt-2.5 pb-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-sm text-col-title flex-1 rounded px-1 py-0.5">
            {column.title}
          </span>
          <button
            className="text-meta-text hover:bg-[#c1c7d0] hover:text-col-title
                       text-base leading-none px-1 py-0.5 rounded transition-colors"
            title="カラムを削除"
          >
            ×
          </button>
        </div>
        {/* Sort bar */}
        <div className="flex gap-1 pb-1">
          <button className="border border-[#b0b8c8] text-meta-text rounded px-2 py-0.5 text-[11px]
                             hover:bg-[#d5d9e0] hover:text-col-title hover:border-[#8993a4] transition-colors">
            ↑ 優先度順
          </button>
          <button className="border border-[#b0b8c8] text-meta-text rounded px-2 py-0.5 text-[11px]
                             hover:bg-[#d5d9e0] hover:text-col-title hover:border-[#8993a4] transition-colors">
            ↑ 期限順
          </button>
        </div>
      </div>

      {/* Card list */}
      <div className="px-2 py-1 flex flex-col gap-1.5 overflow-y-auto flex-1">
        {sorted.map(card => (
          <Card key={card.id} card={card} />
        ))}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded shadow-sm px-2.5 py-2 flex flex-col gap-2"
          >
            <input
              ref={titleRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="カードのタイトル"
              className="w-full border border-[#b0b8c8] rounded px-2 py-1 text-sm
                         text-col-title placeholder-meta-text focus:outline-none
                         focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]"
            />
            <div className="flex gap-2">
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="flex-1 border border-[#b0b8c8] rounded px-2 py-1 text-sm
                           text-col-title bg-white focus:outline-none
                           focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]"
              >
                <option value="">優先度（任意）</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="flex-1 border border-[#b0b8c8] rounded px-2 py-1 text-sm
                           text-col-title focus:outline-none
                           focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]"
              />
            </div>
            <div className="flex gap-1.5">
              <button
                type="submit"
                disabled={isPending || !title.trim()}
                className="bg-[#0052cc] hover:bg-[#0047b3] disabled:opacity-50
                           text-white text-sm font-semibold px-3 py-1 rounded
                           transition-colors"
              >
                {isPending ? '追加中…' : 'カードを追加'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="text-meta-text hover:bg-[#cdd0d6] hover:text-col-title
                           text-sm px-2 py-1 rounded transition-colors"
              >
                ✕
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Add card button — only shown when form is closed */}
      {!showForm && (
        <div className="px-2 pb-2 pt-1.5">
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-transparent text-left px-2 py-1.5 rounded text-sm text-meta-text
                       hover:bg-[#cdd0d6] hover:text-col-title transition-colors"
          >
            + カード追加
          </button>
        </div>
      )}
    </div>
  )
}
