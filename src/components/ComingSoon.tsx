// Placeholder for the tabs that arrive in later phases (Passport, Challenges, Tips).
export default function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-slate-500">
      <p className="text-lg font-semibold text-slate-700">{label}</p>
      <p className="text-sm">Coming in a later phase.</p>
    </div>
  )
}
