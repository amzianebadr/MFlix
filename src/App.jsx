import { NavLink, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import EmbedMoviePage from './pages/EmbedMoviePage';
import EmbedTVPage from './pages/EmbedTVPage';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SearchPage from './pages/SearchPage';
import TVDetailsPage from './pages/TVDetailsPage';

function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-brand-border bg-brand-panel/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-brand-muted sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
          <p>Built for cinematic discovery with TMDB data.</p>
          <p>
            Need a quick search? Visit{' '}
            <NavLink className="text-brand-accent hover:text-yellow-300" to="/search">
              Search
            </NavLink>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/tv/:id" element={<TVDetailsPage />} />
        <Route path="/embed/movie/:tmdbId" element={<EmbedMoviePage />} />
        <Route path="/embed/tv/:tmdbId/:season/:episode" element={<EmbedTVPage />} />
      </Route>
    </Routes>
  );
}
