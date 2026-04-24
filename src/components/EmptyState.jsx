export default function EmptyState({
  title = 'Nothing to show',
  message = 'Try a different search or filter to explore more titles.',
}) {
  return (
    <div className="rounded-3xl border border-brand-border bg-brand-panel/70 px-6 py-12 text-center shadow-glow">
      <p className="font-semibold text-brand-text">{title}</p>
      <p className="mt-3 text-sm text-brand-muted">{message}</p>
    </div>
  );
}
