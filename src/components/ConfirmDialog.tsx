type Props = {
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

// A small "are you sure?" overlay for destructive actions. Mirrors the VisitNotes / CountryTips
// overlay pattern (tap the backdrop = cancel). Confirm is styled rose to read as destructive.
export default function ConfirmDialog({ message, confirmLabel, onConfirm, onCancel }: Props) {
  return (
    <div
      onClick={(e) => {
        // Stop the click reaching an ancestor overlay (e.g. VisitNotes) that would also close.
        e.stopPropagation()
        onCancel()
      }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="flex w-[90%] max-w-xs flex-col gap-4 rounded-2xl bg-white p-5 shadow-2xl"
      >
        <p className="text-sm text-slate-700">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
