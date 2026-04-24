import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getGenres, searchMulti } from '../api/tmdb';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import MediaGrid from '../components/MediaGrid';
import SectionHeader from '../components/SectionHeader';

const filters = ['all', 'movie', 'tv'];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [genreMap, setGenreMap] = useState({});

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    let active = true;

    async function loadGenres() {
      try {
        const [movieGenres, tvGenres] = await Promise.all([getGenres('movie'), getGenres('tv')]);
        if (!active) {
          return;
        }

        const map = [...movieGenres, ...tvGenres].reduce((accumulator, genre) => {
          accumulator[genre.id] = genre.name;
          return accumulator;
        }, {});

        setGenreMap(map);
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Failed to load genres.');
        }
      }
    }

    loadGenres();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function runSearch() {
      if (!initialQuery.trim()) {
        setResults([]);
        setError('');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await searchMulti(initialQuery.trim());

        if (active) {
          setResults(data);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Search failed.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    const timeoutId = window.setTimeout(runSearch, 350);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [initialQuery]);

  const filteredResults = useMemo(() => {
    if (filter === 'all') {
      return results;
    }

    return results.filter((item) => item.mediaType === filter);
  }, [filter, results]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!query.trim()) {
      setSearchParams({});
      return;
    }

    setSearchParams({ q: query.trim() });
  }

  return (
    <div className="space-y-8">
      <section className="section-shell space-y-6 px-5 py-6 sm:px-8 sm:py-8">
        <SectionHeader
          description="Search across movies and TV series with one shared TMDB query."
          title="Search Library"
        />

        <form className="grid gap-4 lg:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
          <input
            className="input-base"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for a title, franchise, or series..."
            type="search"
            value={query}
          />
          <button
            className="inline-flex items-center justify-center rounded-full bg-brand-accent px-6 py-3 text-sm font-extrabold uppercase tracking-[0.2em] text-brand-bg transition hover:bg-yellow-300"
            type="submit"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-3">
          {filters.map((option) => {
            const active = filter === option;

            return (
              <button
                className={`pill-button ${
                  active
                    ? 'border-brand-accent bg-brand-accent text-brand-bg'
                    : 'border-brand-border bg-brand-panelAlt text-brand-text hover:border-brand-accent hover:text-brand-accent'
                }`}
                key={option}
                onClick={() => setFilter(option)}
                type="button"
              >
                {option === 'all' ? 'All' : option === 'movie' ? 'Movies' : 'TV Series'}
              </button>
            );
          })}
        </div>
      </section>

      {loading ? <Loader label="Searching TMDB..." /> : null}
      {!loading && error ? <ErrorMessage message={error} title="Search unavailable" /> : null}

      {!loading && !error && initialQuery && !filteredResults.length ? (
        <EmptyState
          message="No matching movies or TV series were found for this query."
          title="No results"
        />
      ) : null}

      {!loading && !error && !initialQuery ? (
        <EmptyState
          message="Search for movies and TV series, then narrow results by type."
          title="Start with a search"
        />
      ) : null}

      {!loading && !error && filteredResults.length ? (
        <section className="space-y-6">
          <SectionHeader
            description={`Showing ${filteredResults.length} result${
              filteredResults.length === 1 ? '' : 's'
            } for "${initialQuery}".`}
            title="Results"
          />
          <MediaGrid genreMap={genreMap} items={filteredResults} />
        </section>
      ) : null}
    </div>
  );
}
