import { getPosterUrl } from '../utils/image';

export default function CastList({ cast = [] }) {
  if (!cast.length) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cast.slice(0, 8).map((person) => (
        <div
          key={`${person.id}-${person.cast_id || person.credit_id}`}
          className="rounded-3xl border border-brand-border bg-brand-panelAlt/90 p-4 shadow-glow"
        >
          <img
            alt={person.name}
            className="aspect-[3/4] w-full rounded-2xl object-cover"
            src={getPosterUrl(person.profile_path)}
          />
          <div className="mt-4 space-y-1">
            <h3 className="font-semibold text-brand-text">{person.name}</h3>
            <p className="text-sm text-brand-muted">{person.character || 'Cast member'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
