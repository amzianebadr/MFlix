const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'https://backend-movies-itms.onrender.com';

export function getWatchRoute(item, season, episode) {
  if (!item) {
    return '';
  }

  const mediaType = item.media_type || item.mediaType;
  const tmdbId = item.tmdbId || item.id;

  if (!mediaType || !tmdbId) {
    return '';
  }

  if (mediaType === 'movie') {
    return `${BACKEND_BASE_URL}/embed/movie/${tmdbId}`;
  }

  if (mediaType === 'tv' && season && episode) {
    return `${BACKEND_BASE_URL}/embed/tv/${tmdbId}/${season}/${episode}`;
  }

  return '';
}

export default getWatchRoute;
