import EmptyState from './EmptyState';
import SectionHeader from './SectionHeader';

function pickTrailer(videos = []) {
  return (
    videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer') ||
    videos.find((video) => video.site === 'YouTube' && video.type === 'Teaser') ||
    null
  );
}

export default function TrailerSection({ videos = [] }) {
  const trailer = pickTrailer(videos);

  return (
    <section className="space-y-6">
      <SectionHeader
        title="Trailer"
        description="Catch the official preview before you jump into the full details."
      />

      {trailer ? (
        <div className="overflow-hidden rounded-3xl border border-brand-border bg-brand-panel shadow-glow">
          <div className="aspect-video">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
            />
          </div>
        </div>
      ) : (
        <EmptyState
          message="No trailer is available from TMDB for this title yet."
          title="Trailer unavailable"
        />
      )}
    </section>
  );
}
