import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getCredits,
  getSimilar,
  getTVDetails,
  getTVSeasonDetails,
  getVideos,
} from '../api/tmdb';
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

export default function TVDetailsPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState('');
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [seasonLoading, setSeasonLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        setLoading(true);
        setError('');
        setSelectedSeason('');
        setSelectedEpisode('');
        setSeasonDetails(null);

        const [details, credits, videoList, similarItems] = await Promise.all([
          getTVDetails(id),
          getCredits('tv', id),
          getVideos('tv', id),
          getSimilar('tv', id),
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
          setError(requestError.message || 'Failed to load the TV series.');
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

  useEffect(() => {
    let active = true;

    async function loadSeason() {
      if (!selectedSeason || !selectedItem?.tmdbId) {
        setSeasonDetails(null);
        return;
      }

      try {
        setSeasonLoading(true);
        const data = await getTVSeasonDetails(selectedItem.tmdbId, selectedSeason);

        if (active) {
          setSeasonDetails(data);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Failed to load season details.');
        }
      } finally {
        if (active) {
          setSeasonLoading(false);
        }
      }
    }

    loadSeason();

    return () => {
      active = false;
    };
  }, [selectedItem, selectedSeason]);

  const selectableSeasons = useMemo(() => {
    return (selectedItem?.seasons || []).filter((season) => season.season_number >= 0);
  }, [selectedItem]);

  if (loading) {
    return <Loader label="Loading TV series details..." />;
  }

  if (error || !selectedItem) {
    return <ErrorMessage message={error} title="TV series unavailable" />;
  }

  const watchDisabled = !selectedSeason || !selectedEpisode;

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
                TV Series
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

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {statLabel(
                'First Air Date',
                selectedItem.releaseDate ? new Date(selectedItem.releaseDate).toLocaleDateString() : 'TBA',
              )}
              {statLabel('Seasons', selectedItem.numberOfSeasons || 'N/A')}
              {statLabel('Episodes', selectedItem.numberOfEpisodes || 'N/A')}
              {statLabel('TMDB Score', selectedItem.voteAverage ? selectedItem.voteAverage.toFixed(1) : 'N/A')}
              {statLabel('Genres', selectedItem.genres?.map((genre) => genre.name).join(', ') || 'N/A')}
            </div>

            <div className="panel-surface space-y-4 p-5">
              <div>
                <h2 className="text-lg font-semibold text-brand-text">Choose an episode to watch</h2>
                <p className="mt-1 text-sm text-brand-muted">
                  TV playback requires a season and episode selection before navigation is enabled.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-brand-muted">Season</span>
                  <select
                    className="select-base w-full"
                    onChange={(event) => {
                      setSelectedSeason(event.target.value);
                      setSelectedEpisode('');
                    }}
                    value={selectedSeason}
                  >
                    <option value="">Select season</option>
                    {selectableSeasons.map((season) => (
                      <option key={season.id || season.season_number} value={season.season_number}>
                        {season.name || `Season ${season.season_number}`}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-brand-muted">Episode</span>
                  <select
                    className="select-base w-full"
                    disabled={!selectedSeason || seasonLoading}
                    onChange={(event) => setSelectedEpisode(event.target.value)}
                    value={selectedEpisode}
                  >
                    <option value="">
                      {seasonLoading ? 'Loading episodes...' : 'Select episode'}
                    </option>
                    {(seasonDetails?.episodes || []).map((episode) => (
                      <option key={episode.id} value={episode.episode_number}>
                        Episode {episode.episode_number}: {episode.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <WatchNowButton
                  className="min-w-[180px]"
                  disabled={watchDisabled}
                  episode={selectedEpisode}
                  item={selectedItem}
                  season={selectedSeason}
                />
                <p className="text-sm text-brand-muted">
                  {watchDisabled
                    ? 'Select both fields to enable Watch Now.'
                    : `Ready to open Season ${selectedSeason}, Episode ${selectedEpisode}.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          description="Principal cast members featured in this TV series."
          title="Cast"
        />
        <CastList cast={cast} />
      </section>

      <TrailerSection videos={videos} />

      <section className="space-y-6">
        <SectionHeader
          description="Explore related series with a similar tone, genre, or audience appeal."
          title="Similar TV Series"
        />
        <MediaGrid items={similar.slice(0, 10)} />
      </section>
    </div>
  );
}
