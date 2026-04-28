import { useColumns } from '../hooks/useColumns'
import Column from './Column'

export default function Board() {
  const { data, isLoading, isError } = useColumns()

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
      </div>
    </main>
  )
}
