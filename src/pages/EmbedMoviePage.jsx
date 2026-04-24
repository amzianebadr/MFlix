import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import getWatchRoute from '../utils/getWatchRoute';

function shouldRenderIframe(route) {
  try {
    return new URL(route).origin !== window.location.origin;
  } catch {
    return false;
  }
}

export default function EmbedMoviePage() {
  const { tmdbId } = useParams();
  const route = useMemo(
    () => getWatchRoute({ id: tmdbId, tmdbId, mediaType: 'movie', media_type: 'movie' }),
    [tmdbId],
  );

  return (
    <section className="space-y-6">
      <SectionHeader
        description="Styled frontend embed route that matches the CineBrowse visual identity."
        title="Movie Player"
      />

      <div className="panel-surface space-y-5 p-5">
        <div className="rounded-2xl border border-brand-border bg-brand-bg px-4 py-3">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-muted">Embed route</p>
          <p className="mt-2 break-all text-sm text-brand-accent">{route}</p>
        </div>

        {shouldRenderIframe(route) ? (
          <div className="overflow-hidden rounded-3xl border border-brand-border bg-black shadow-accent">
            <iframe className="h-[70vh] w-full" src={route} title={`Movie embed ${tmdbId}`} />
          </div>
        ) : (
          <div className="rounded-3xl border border-brand-border bg-brand-panelAlt px-6 py-16 text-center">
            <p className="text-lg font-semibold text-brand-text">Backend player route ready</p>
            <p className="mt-3 text-sm text-brand-muted">
              This frontend route is styled for consistency. Use the backend URL above to serve the
              actual movie player.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
