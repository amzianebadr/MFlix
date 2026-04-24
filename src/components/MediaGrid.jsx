import EmptyState from './EmptyState';
import MediaCard from './MediaCard';

export default function MediaGrid({ items = [], genreMap = {} }) {
  if (!items.length) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <MediaCard genreMap={genreMap} item={item} key={`${item.mediaType}-${item.tmdbId}`} />
      ))}
    </div>
  );
}
