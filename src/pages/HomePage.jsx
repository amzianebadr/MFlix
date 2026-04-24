import { useEffect, useMemo, useState } from 'react';
import {
  getGenres,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getTopRatedTV,
  getTrendingMovies,
  getTrendingTV,
} from '../api/tmdb';
import GenreList from '../components/GenreList';
import Hero from '../components/Hero';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import MediaGrid from '../components/MediaGrid';
import SectionHeader from '../components/SectionHeader';

function buildGenreMap(movieGenres, tvGenres) {
  return [...movieGenres, ...tvGenres].reduce((map, genre) => {
    map[genre.id] = genre.name;
    return map;
  }, {});
}

function filterByGenre(items, genreId) {
  if (!genreId) {
    return items;
  }

  return items.filter((item) => item.genres?.includes(genreId));
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [movieGenreId, setMovieGenreId] = useState(null);
  const [tvGenreId, setTvGenreId] = useState(null);
  const [sections, setSections] = useState({
    trendingMovies: [],
    trendingTV: [],
    popularMovies: [],
    popularTV: [],
    topRatedMovies: [],
    topRatedTV: [],
    movieGenres: [],
    tvGenres: [],
  });

  useEffect(() => {
    let active = true;

    async function loadHome() {
      try {
        setLoading(true);
        setError('');

        const [
          trendingMovies,
          trendingTV,
          popularMovies,
          popularTV,
          topRatedMovies,
          topRatedTV,
          movieGenres,
          tvGenres,
        ] = await Promise.all([
          getTrendingMovies(),
          getTrendingTV(),
          getPopularMovies(),
          getPopularTV(),
          getTopRatedMovies(),
          getTopRatedTV(),
          getGenres('movie'),
          getGenres('tv'),
        ]);

        if (!active) {
          return;
        }

        setSections({
          trendingMovies,
          trendingTV,
          popularMovies,
          popularTV,
          topRatedMovies,
          topRatedTV,
          movieGenres,
          tvGenres,
        });
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Failed to load the home page.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadHome();

    return () => {
      active = false;
    };
  }, []);

  const genreMap = useMemo(
    () => buildGenreMap(sections.movieGenres, sections.tvGenres),
    [sections.movieGenres, sections.tvGenres],
  );

  const filteredPopularMovies = useMemo(
    () => filterByGenre(sections.popularMovies, movieGenreId),
    [sections.popularMovies, movieGenreId],
  );
  const filteredPopularTV = useMemo(
    () => filterByGenre(sections.popularTV, tvGenreId),
    [sections.popularTV, tvGenreId],
  );

  if (loading) {
    return <Loader label="Loading CineBrowse..." />;
  }

  if (error) {
    return <ErrorMessage message={error} title="Home page unavailable" />;
  }

  const featuredItem = sections.trendingMovies[0] || sections.trendingTV[0];

  return (
    <div className="space-y-10">
      <Hero item={featuredItem} />

      <section className="space-y-6">
        <SectionHeader
          description="The titles audiences are talking about this week."
          title="Trending Movies"
        />
        <MediaGrid genreMap={genreMap} items={sections.trendingMovies.slice(0, 10)} />
      </section>

      <section className="space-y-6">
        <SectionHeader
          description="Binge-worthy television picks trending across TMDB."
          title="Trending TV Series"
        />
        <MediaGrid genreMap={genreMap} items={sections.trendingTV.slice(0, 10)} />
      </section>

      <section className="section-shell space-y-8 px-5 py-6 sm:px-8 sm:py-8">
        <SectionHeader
          description="Browse popular releases and narrow them down by genre."
          title="Genre Browsing"
        />

        <div className="grid gap-8 xl:grid-cols-2">
          <div className="space-y-5">
            <SectionHeader
              description="Popular movies filtered by your chosen genre."
              title="Movie Genres"
            />
            <GenreList
              genres={sections.movieGenres}
              onSelect={setMovieGenreId}
              selectedGenre={movieGenreId}
            />
            <MediaGrid genreMap={genreMap} items={filteredPopularMovies.slice(0, 10)} />
          </div>

          <div className="space-y-5">
            <SectionHeader
              description="Popular TV series filtered by genre."
              title="TV Genres"
            />
            <GenreList
              genres={sections.tvGenres}
              onSelect={setTvGenreId}
              selectedGenre={tvGenreId}
            />
            <MediaGrid genreMap={genreMap} items={filteredPopularTV.slice(0, 10)} />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          description="Audience favorites with broad appeal and strong momentum."
          title="Popular Movies"
        />
        <MediaGrid genreMap={genreMap} items={sections.popularMovies.slice(0, 10)} />
      </section>

      <section className="space-y-6">
        <SectionHeader
          description="Current TV favorites for your next big series marathon."
          title="Popular TV Series"
        />
        <MediaGrid genreMap={genreMap} items={sections.popularTV.slice(0, 10)} />
      </section>

      <section className="space-y-6">
        <SectionHeader
          description="Top-rated films with standout acclaim and strong viewer scores."
          title="Top Rated Movies"
        />
        <MediaGrid genreMap={genreMap} items={sections.topRatedMovies.slice(0, 10)} />
      </section>

      <section className="space-y-6">
        <SectionHeader
          description="Critically loved television with deep catalogs worth exploring."
          title="Top Rated TV Series"
        />
        <MediaGrid genreMap={genreMap} items={sections.topRatedTV.slice(0, 10)} />
      </section>
    </div>
  );
}
