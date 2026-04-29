import { useEffect } from 'react'
import ReactDOM from 'react-dom'

interface Props {
  message: string
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}

export default function DeleteConfirmModal({ message, onConfirm, onCancel, isPending }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onCancel])

  const modal = (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-72 p-5"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-bold text-base mb-2 text-col-title">削除の確認</h2>
        <p className="text-sm text-meta-text mb-5">{message}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 bg-[#de350b] hover:bg-[#bf2600] disabled:opacity-50
                       text-white text-sm font-semibold py-1.5 rounded transition-colors"
          >
            {isPending ? '削除中…' : '削除'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 text-meta-text hover:bg-[#cdd0d6] text-sm py-1.5 rounded
                       transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  )

  return ReactDOM.createPortal(modal, document.body)
}
