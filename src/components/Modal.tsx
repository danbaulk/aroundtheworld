type ModalProps = {
  onClose: () => void
  role?: 'dialog' | 'alertdialog'
  /** Render above another open modal: higher z-index, and keep the backdrop click from closing the parent. */
  topmost?: boolean
  /** Card sizing/layout; the rounded white card chrome is always applied. */
  cardClassName?: string
  children: React.ReactNode
}

// The shared centred-card overlay: a dimmed fullscreen backdrop (tap = close) with a white card
// that swallows its own clicks. Every pop-up (tips, notes, add-visit, badge detail, confirm)
// composes this shell.
export default function Modal({
  onClose,
  role = 'dialog',
  topmost = false,
  cardClassName = 'flex max-h-[80vh] w-[90%] max-w-md flex-col',
  children,
}: ModalProps) {
  return (
    <div
      onClick={(e) => {
        if (topmost) e.stopPropagation()
        onClose()
      }}
      className={`fixed inset-0 ${topmost ? 'z-40' : 'z-30'} flex items-center justify-center bg-slate-900/50 p-4`}
    >
      <div
        role={role}
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`${cardClassName} rounded-2xl bg-white shadow-2xl`}
      >
        {children}
      </div>
    </div>
  )
}

type ModalHeaderProps = {
  /** Content of the heading — typically a flag/icon span followed by the name. */
  title: React.ReactNode
  subtitle?: React.ReactNode
  onClose: () => void
}

/** The card's title bar: heading (+ optional subtitle) on the left, an × close button on the right. */
export function ModalHeader({ title, subtitle, onClose }: ModalHeaderProps) {
  const heading = <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">{title}</h2>
  return (
    <div
      className={`flex ${subtitle ? 'items-start' : 'items-center'} justify-between border-b border-slate-100 p-4`}
    >
      {subtitle ? (
        <div>
          {heading}
          <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
        </div>
      ) : (
        heading
      )}
      <button
        onClick={onClose}
        aria-label="Close"
        className="rounded-full px-2 text-xl leading-none text-slate-400 hover:text-slate-700"
      >
        ×
      </button>
    </div>
  )
}
