// Placeholder for the not-yet-built per-visit photo uploads. Shared by the AddVisit form and the
// VisitNotes pop-up so the "coming soon" affordance stays identical in both.
export default function PhotosPlaceholder() {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Photos</p>
      <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-6 text-center text-sm text-slate-400">
        <span className="text-2xl" aria-hidden>
          📷
        </span>
        Photo uploads coming soon
      </div>
    </div>
  )
}
