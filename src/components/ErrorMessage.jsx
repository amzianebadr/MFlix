export default function ErrorMessage({
  title = 'Something went wrong',
  message = 'We could not load this section right now. Please try again.',
}) {
  return (
    <div className="rounded-3xl border border-red-500/25 bg-red-950/20 px-5 py-4 text-sm shadow-glow">
      <p className="font-semibold text-red-200">{title}</p>
      <p className="mt-2 text-brand-muted">{message}</p>
    </div>
  );
}
