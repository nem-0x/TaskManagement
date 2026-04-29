import { useState, useRef, useEffect } from 'react'
import { useColumns } from '../hooks/useColumns'
import { useCreateColumn } from '../hooks/useCreateColumn'
import Column from './Column'

interface Props {
  showAddColumn: boolean
  onCloseAddColumn: () => void
}

export default function Board({ showAddColumn, onCloseAddColumn }: Props) {
  const { data, isLoading, isError } = useColumns()
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutate, isPending } = useCreateColumn()

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

    mutate({ title: trimmed }, {
      onSuccess: () => onCloseAddColumn(),
    })
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
  )
}
