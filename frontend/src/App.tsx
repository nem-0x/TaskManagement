import { useState } from 'react'
import Board from './components/Board'

export default function App() {
  const [showColumnForm, setShowColumnForm] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-board-bg">
      <header className="bg-header-bg px-4 py-2.5 flex items-center justify-between shadow-md">
        <h1 className="text-white text-lg font-bold tracking-wide">タスク管理アプリ</h1>
        <button
          onClick={() => setShowColumnForm(true)}
          className="bg-white/25 hover:bg-white/[0.38] text-white text-sm font-semibold px-3.5 py-1.5 rounded transition-colors"
        >
          + カラム追加
        </button>
      </header>
      <Board showAddColumn={showColumnForm} onCloseAddColumn={() => setShowColumnForm(false)} />
    </div>
  )
}
