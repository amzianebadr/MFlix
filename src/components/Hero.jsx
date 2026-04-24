import { Link } from 'react-router-dom';
import { getBackdropUrl, getPosterUrl } from '../utils/image';

export default function Hero({ item }) {
  if (!item) {
    return null;
  }

  const detailPath = item.mediaType === 'tv' ? `/tv/${item.tmdbId}` : `/movie/${item.tmdbId}`;

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-brand-border bg-brand-panel shadow-accent">
      <img
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover opacity-45"
        src={getBackdropUrl(item.backdropPath)}
      />
      <div className="absolute inset-0 bg-hero-fade" />

      <div className="relative grid min-h-[520px] gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.3fr_320px] lg:px-12 lg:py-14">
        <div className="flex flex-col justify-end gap-6">
          <span className="inline-flex w-fit rounded-full border border-brand-accent/40 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-brand-accent">
            Featured this week
          </span>

          <div className="max-w-3xl space-y-5">
            <h1 className="font-display text-5xl font-bold leading-none text-white sm:text-6xl lg:text-7xl">
              {item.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-brand-muted sm:text-lg">
              {item.overview}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-brand-muted">
            <span className="rounded-full border border-brand-border bg-black/35 px-4 py-2">
              {item.mediaType === 'tv' ? 'TV Series' : 'Movie'}
            </span>
            <span className="rounded-full border border-brand-border bg-black/35 px-4 py-2">
              ⭐ {item.voteAverage ? item.voteAverage.toFixed(1) : 'N/A'}
            </span>
            <span className="rounded-full border border-brand-border bg-black/35 px-4 py-2">
              {item.releaseDate ? new Date(item.releaseDate).toLocaleDateString() : 'TBA'}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center justify-center rounded-full bg-brand-accent px-6 py-3 text-sm font-extrabold uppercase tracking-[0.2em] text-brand-bg transition hover:bg-yellow-300"
              to={detailPath}
            >
              Explore Title
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-brand-accent bg-black/25 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-text transition hover:bg-brand-accent hover:text-brand-bg"
              to="/search"
            >
              Browse Library
            </Link>
          </div>
        </div>

        <div className="hidden items-end justify-end lg:flex">
          <img
            alt={item.title}
            className="w-full max-w-[280px] rounded-[28px] border border-white/10 object-cover shadow-accent"
            src={getPosterUrl(item.posterPath)}
          />
        </div>
      </div>
    </section>
  );
}
