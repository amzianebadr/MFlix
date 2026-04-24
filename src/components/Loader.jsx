export default function Loader({ label = 'Loading cinematic picks...' }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-3xl border border-brand-border bg-brand-panel/70 px-6 py-12 text-center shadow-glow">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-border border-t-brand-accent" />
      <p className="text-sm text-brand-muted">{label}</p>
    </div>
  );
}
