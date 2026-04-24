import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCredits, getMovieDetails, getSimilar, getVideos } from '../api/tmdb';
import CastList from '../components/CastList';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import MediaGrid from '../components/MediaGrid';
import SectionHeader from '../components/SectionHeader';
import TrailerSection from '../components/TrailerSection';
import WatchNowButton from '../components/WatchNowButton';
import { getBackdropUrl, getPosterUrl } from '../utils/image';

function statLabel(label, value) {
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-panelAlt/90 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.25em] text-brand-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-brand-text">{value}</p>
    </div>
  );
}

export default function MovieDetailsPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        setLoading(true);
        setError('');

        const [details, credits, videoList, similarItems] = await Promise.all([
          getMovieDetails(id),
          getCredits('movie', id),
          getVideos('movie', id),
          getSimilar('movie', id),
        ]);

        if (!active) {
          return;
        }

        setSelectedItem(details);
        setCast(credits);
        setVideos(videoList);
        setSimilar(similarItems);
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Failed to load the movie.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      active = false;
    };
  }, [id]);

  const releaseYear = useMemo(() => {
    if (!selectedItem?.releaseDate) {
      return 'TBA';
    }

    return new Date(selectedItem.releaseDate).getFullYear();
  }, [selectedItem]);

  if (loading) {
    return <Loader label="Loading movie details..." />;
  }

  if (error || !selectedItem) {
    return <ErrorMessage message={error} title="Movie unavailable" />;
  }

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-brand-border bg-brand-panel shadow-accent">
        <img
          alt={selectedItem.title}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          src={getBackdropUrl(selectedItem.backdropPath)}
        />
        <div className="absolute inset-0 bg-hero-fade" />

        <div className="relative grid gap-8 px-6 py-8 lg:grid-cols-[300px_1fr] lg:px-10 lg:py-10">
          <img
            alt={selectedItem.title}
            className="w-full max-w-[300px] rounded-[28px] border border-white/10 object-cover shadow-accent"
            src={getPosterUrl(selectedItem.posterPath)}
          />

          <div className="space-y-6">
            <Link className="inline-flex text-sm text-brand-accent hover:text-yellow-300" to="/">
              ← Back to home
            </Link>

            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-brand-accent/40 bg-black/35 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-brand-accent">
                Movie
              </span>
              <h1 className="font-display text-5xl font-bold leading-none text-white">
                {selectedItem.title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-brand-muted">{selectedItem.overview}</p>
              <div className="flex flex-wrap gap-2">
                {(selectedItem.genres || []).map((genre) => (
                  <span
                    className="rounded-full border border-brand-accent/40 bg-brand-panelAlt px-3 py-1 text-xs font-medium text-brand-accent"
                    key={genre.id}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {statLabel('Release', releaseYear)}
              {statLabel('Runtime', selectedItem.runtime ? `${selectedItem.runtime} min` : 'N/A')}
              {statLabel('TMDB Score', selectedItem.voteAverage ? selectedItem.voteAverage.toFixed(1) : 'N/A')}
              {statLabel('Genres', selectedItem.genres?.map((genre) => genre.name).join(', ') || 'N/A')}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <WatchNowButton className="min-w-[180px]" item={selectedItem} />
              <Link
                className="inline-flex items-center justify-center rounded-full border border-brand-accent px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-text transition hover:bg-brand-accent hover:text-brand-bg"
                to="/search"
              >
                Discover More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          description="Principal cast members appearing in this movie."
          title="Cast"
        />
        <CastList cast={cast} />
      </section>

      <TrailerSection videos={videos} />

      <section className="space-y-6">
        <SectionHeader
          description="If you enjoyed this title, these similar movies are a great next stop."
          title="Similar Movies"
        />
        <MediaGrid items={similar.slice(0, 10)} />
      </section>
    </div>
  );
}
