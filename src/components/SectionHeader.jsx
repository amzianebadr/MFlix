export default function SectionHeader({ title, description, action }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <div className="h-1 w-14 rounded-full bg-brand-accent" />
        <h2 className="font-display text-3xl font-bold tracking-wide text-brand-text md:text-4xl">
          {title}
        </h2>
        {description ? <p className="max-w-2xl text-sm text-brand-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
