import type { ColumnResponse } from '../types/api'
import Card from './Card'

interface Props {
  column: ColumnResponse
}

export default function Column({ column }: Props) {
  const sorted = [...column.cards].sort((a, b) => a.position - b.position)

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
      </div>

      {/* Add card placeholder */}
      <div className="px-2 pb-2 pt-1.5">
        <button className="w-full bg-transparent text-left px-2 py-1.5 rounded text-sm text-meta-text
                           hover:bg-[#cdd0d6] hover:text-col-title transition-colors">
          + カード追加
        </button>
      </div>
    </div>
  )
}
