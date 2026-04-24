import { Link } from 'react-router-dom';
import { getPosterUrl } from '../utils/image';

function resolveGenreNames(item, genreMap = {}) {
  if (!item.genres) {
    return [];
  }

  if (Array.isArray(item.genres) && typeof item.genres[0] === 'object') {
    return item.genres.map((genre) => genre.name);
  }

  return item.genres.map((genreId) => genreMap[genreId]).filter(Boolean);
}

export default function MediaCard({ item, genreMap = {} }) {
  const detailPath = item.mediaType === 'tv' ? `/tv/${item.tmdbId}` : `/movie/${item.tmdbId}`;
  const genreNames = resolveGenreNames(item, genreMap).slice(0, 2);

  return (
    <Link
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-brand-border bg-brand-panelAlt shadow-glow transition duration-300 hover:-translate-y-1 hover:border-brand-accent/60 hover:shadow-accent"
      to={detailPath}
    >
      <div className="relative overflow-hidden">
        <img
          alt={item.title}
          className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-105"
          src={getPosterUrl(item.posterPath)}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-4 pt-14">
          <span className="inline-flex rounded-full border border-brand-accent/50 bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-accent">
            {item.mediaType === 'tv' ? 'TV Series' : 'Movie'}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-lg font-semibold text-brand-text">{item.title}</h3>
          <p className="text-sm text-brand-muted">
            {item.releaseDate ? new Date(item.releaseDate).getFullYear() : 'Coming soon'}
            {' • '}
            ⭐ {item.voteAverage ? item.voteAverage.toFixed(1) : 'N/A'}
          </p>
        </div>

        {genreNames.length ? (
          <div className="flex flex-wrap gap-2">
            {genreNames.map((name) => (
              <span
                key={name}
                className="rounded-full border border-brand-accent/40 bg-brand-panel px-3 py-1 text-xs text-brand-accent"
              >
                {name}
              </span>
            ))}
          </div>
        ) : null}

        <p className="line-clamp-3 text-sm leading-6 text-brand-muted">{item.overview}</p>
      </div>
    </Link>
  );
}
