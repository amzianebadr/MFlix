export function formatMedia(item, fallbackMediaType) {
  if (!item) {
    return null;
  }

  const mediaType = item.media_type || item.mediaType || fallbackMediaType || 'movie';
  const title = item.title || item.name || 'Untitled';
  const date = item.release_date || item.first_air_date || '';

  return {
    id: item.id,
    tmdbId: item.tmdbId || item.id,
    mediaType,
    media_type: mediaType,
    title,
    overview: item.overview || 'No overview is available yet.',
    posterPath: item.poster_path || item.posterPath || '',
    backdropPath: item.backdrop_path || item.backdropPath || '',
    releaseDate: date,
    voteAverage: item.vote_average || item.voteAverage || 0,
    genres: item.genres || item.genre_ids || [],
    runtime: item.runtime || null,
    numberOfSeasons: item.number_of_seasons || 0,
    numberOfEpisodes: item.number_of_episodes || 0,
    seasons: item.seasons || [],
  };
}

export function formatMediaList(items = [], fallbackMediaType) {
  return items
    .map((item) => formatMedia(item, fallbackMediaType))
    .filter(Boolean);
}
