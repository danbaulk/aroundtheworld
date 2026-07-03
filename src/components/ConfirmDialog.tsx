import Modal from './Modal'

type Props = {
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

// A small "are you sure?" overlay for destructive actions, always opened over another pop-up
// (hence topmost). Confirm is styled rose to read as destructive.
export default function ConfirmDialog({ message, confirmLabel, onConfirm, onCancel }: Props) {
  return (
    <Modal
      onClose={onCancel}
      role="alertdialog"
      topmost
      cardClassName="flex w-[90%] max-w-xs flex-col gap-4 p-5"
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
    </Modal>
  )
}
