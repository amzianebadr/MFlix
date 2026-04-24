export default function GenreList({ genres = [], selectedGenre, onSelect, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`.trim()}>
      <button
        className={`pill-button ${
          !selectedGenre
            ? 'border-brand-accent bg-brand-accent text-brand-bg'
            : 'border-brand-border bg-brand-panelAlt text-brand-muted hover:border-brand-accent hover:text-brand-text'
        }`}
        onClick={() => onSelect?.(null)}
        type="button"
      >
        All
      </button>

      {genres.map((genre) => {
        const active = selectedGenre === genre.id;

        return (
          <button
            key={genre.id}
            className={`pill-button ${
              active
                ? 'border-brand-accent bg-brand-accent text-brand-bg'
                : 'border-brand-accent/40 bg-brand-panelAlt text-brand-accent hover:border-brand-accent hover:bg-brand-accent/10'
            }`}
            onClick={() => onSelect?.(genre.id)}
            type="button"
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}
