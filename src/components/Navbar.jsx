import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Search', to: '/search' },
];

function navClassName({ isActive }) {
  return `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-brand-accent text-brand-bg'
      : 'text-brand-text hover:bg-brand-panelAlt hover:text-brand-accent'
  }`;
}

export default function Navbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    if (!query.trim()) {
      navigate('/search');
      setMenuOpen(false);
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-bg/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink className="flex shrink-0 items-center gap-3" to="/">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-accent/40 bg-brand-accent text-lg font-black text-brand-bg shadow-accent">
            C
          </div>
          <div>
            <p className="font-display text-3xl leading-none text-brand-text">MFlix</p>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-muted">Cinema Curated</p>
          </div>
        </NavLink>

        <nav className="hidden flex-1 items-center justify-center gap-2 md:flex">
          {links.map((link) => (
            <NavLink className={navClassName} key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <form className="hidden w-full max-w-sm md:block" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              className="input-base pr-24"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies or TV series..."
              type="search"
              value={query}
            />
            <button
              className="absolute right-1.5 top-1.5 rounded-full bg-brand-accent px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-bg transition hover:bg-yellow-300"
              type="submit"
            >
              Search
            </button>
          </div>
        </form>

        <button
          aria-label="Toggle navigation menu"
          className="ml-auto inline-flex rounded-2xl border border-brand-border bg-brand-panelAlt p-3 text-brand-text md:hidden"
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
        >
          <span className="text-lg">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-brand-border bg-brand-panel/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <NavLink
                className={navClassName}
                key={link.to}
                onClick={() => setMenuOpen(false)}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
            <form className="pt-2" onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <input
                  className="input-base"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search movies or TV series..."
                  type="search"
                  value={query}
                />
                <button
                  className="rounded-full bg-brand-accent px-4 py-3 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-bg"
                  type="submit"
                >
                  Go
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </header>
  );
}
