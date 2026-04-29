import { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { toValidPriority, type CardResponse } from '../types/api'
import { useUpdateCard } from '../hooks/useUpdateCard'

interface Props {
  card: CardResponse
  onClose: () => void
}

export default function CardEditModal({ card, onClose }: Props) {
  const [title, setTitle] = useState(card.title)
  const [priority, setPriority] = useState(card.priority ?? '')
  const [dueDate, setDueDate] = useState(card.due_date ?? '')
  const titleRef = useRef<HTMLInputElement>(null)
  const { mutate, isPending } = useUpdateCard()

  useEffect(() => {
    titleRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    mutate(
      {
        id: card.id,
        req: {
          title: trimmed,
          priority: toValidPriority(priority),
          due_date: dueDate || null,
        },
      },
      { onSuccess: onClose }
    )
  }

  const modal = (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-80 p-5"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-bold text-base mb-4 text-col-title">カードを編集</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            ref={titleRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="タイトル"
            className="w-full border border-[#b0b8c8] rounded px-2 py-1.5 text-sm
                       text-col-title focus:outline-none focus:border-[#0052cc]
                       focus:ring-1 focus:ring-[#0052cc]"
          />
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            className="w-full border border-[#b0b8c8] rounded px-2 py-1.5 text-sm
                       text-col-title bg-white focus:outline-none focus:border-[#0052cc]
                       focus:ring-1 focus:ring-[#0052cc]"
          >
            <option value="">優先度なし</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full border border-[#b0b8c8] rounded px-2 py-1.5 text-sm
                       text-col-title focus:outline-none focus:border-[#0052cc]
                       focus:ring-1 focus:ring-[#0052cc]"
          />
          <div className="flex gap-2 mt-1">
            <button
              type="submit"
              disabled={isPending || !title.trim()}
              className="flex-1 bg-[#0052cc] hover:bg-[#0047b3] disabled:opacity-50
                         text-white text-sm font-semibold py-1.5 rounded transition-colors"
            >
              {isPending ? '保存中…' : '保存'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-meta-text hover:bg-[#cdd0d6] text-sm py-1.5 rounded
                         transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return ReactDOM.createPortal(modal, document.body)
}
