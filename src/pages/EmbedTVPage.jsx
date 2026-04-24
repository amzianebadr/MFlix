import { useMemo, useState } from 'react';
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

export default function EmbedTVPage() {
  const { tmdbId, season, episode } = useParams();
  const [loadPlayer, setLoadPlayer] = useState(false);

  const route = useMemo(
    () =>
      getWatchRoute(
        { id: tmdbId, tmdbId, mediaType: 'tv', media_type: 'tv' },
        season,
        episode,
      ),
    [tmdbId, season, episode],
  );

  return (
    <section className="space-y-6">
      <SectionHeader
        description="Frontend embed view for a selected TV series episode."
        title="Episode Player"
      />

      <div className="panel-surface space-y-5 p-5">
        {/* معلومات */}
        <div className="grid gap-4 md:grid-cols-3">
          <InfoBox label="TMDB ID" value={tmdbId} />
          <InfoBox label="Season" value={season} />
          <InfoBox label="Episode" value={episode} />
        </div>

        <div className="rounded-2xl border border-brand-border bg-brand-bg px-4 py-3">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-muted">Embed route</p>
          <p className="mt-2 break-all text-sm text-brand-accent">{route}</p>
        </div>

        {shouldRenderIframe(route) ? (
          <div className="overflow-hidden rounded-3xl border border-brand-border bg-black shadow-accent">

            {!loadPlayer ? (
              <div className="flex h-[70vh] items-center justify-center">
                <button
                  onClick={() => setLoadPlayer(true)}
                  className="rounded-xl bg-brand-accent px-6 py-3 text-white"
                >
                  ▶ Play Episode
                </button>
              </div>
            ) : (
              <iframe
                className="h-[70vh] w-full"
                src={route}
                sandbox="allow-scripts allow-same-origin"
                referrerPolicy="no-referrer"
                allowFullScreen
              />
            )}
          </div>
        ) : (
          <div className="rounded-3xl border border-brand-border bg-brand-panelAlt px-6 py-16 text-center">
            <p className="text-lg font-semibold text-brand-text">Backend player route ready</p>
            <p className="mt-3 text-sm text-brand-muted">
              This frontend route is present for parity, but the actual player should be served from
              the backend embed URL shown above.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-bg px-4 py-3">
      <p className="text-xs uppercase tracking-[0.3em] text-brand-muted">{label}</p>
      <p className="mt-2 text-brand-text">{value}</p>
    </div>
  );
}