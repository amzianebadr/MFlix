import { formatMedia, formatMediaList } from '../utils/formatMedia';

const TOKEN = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

function createUrl(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

async function tmdbFetch(path, params = {}) {
  if (!TOKEN) {
    throw new Error('Missing VITE_TMDB_API_KEY. Add it to your .env file.');
  }

  const response = await fetch(createUrl(path, params), {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
}

async function getCollection(path, mediaType, params = {}) {
  const data = await tmdbFetch(path, params);
  return formatMediaList(data.results || [], mediaType);
}

export function getTrendingMovies() {
  return getCollection('/trending/movie/week', 'movie');
}

export function getTrendingTV() {
  return getCollection('/trending/tv/week', 'tv');
}

export function getPopularMovies() {
  return getCollection('/movie/popular', 'movie');
}

export function getPopularTV() {
  return getCollection('/tv/popular', 'tv');
}

export function getTopRatedMovies() {
  return getCollection('/movie/top_rated', 'movie');
}

export function getTopRatedTV() {
  return getCollection('/tv/top_rated', 'tv');
}

export async function getMovieDetails(id) {
  const data = await tmdbFetch(`/movie/${id}`);
  return formatMedia({ ...data, media_type: 'movie' }, 'movie');
}

export async function getTVDetails(id) {
  const data = await tmdbFetch(`/tv/${id}`);
  return formatMedia({ ...data, media_type: 'tv' }, 'tv');
}

export async function getCredits(mediaType, id) {
  const data = await tmdbFetch(`/${mediaType}/${id}/credits`);
  return data.cast || [];
}

export async function getVideos(mediaType, id) {
  const data = await tmdbFetch(`/${mediaType}/${id}/videos`);
  return data.results || [];
}

export async function getSimilar(mediaType, id) {
  const data = await tmdbFetch(`/${mediaType}/${id}/similar`);
  return formatMediaList(data.results || [], mediaType);
}

export async function searchMulti(query) {
  const data = await tmdbFetch('/search/multi', { query });
  return formatMediaList(
    (data.results || []).filter((item) => item.media_type !== 'person'),
  );
}

export async function getGenres(mediaType) {
  const data = await tmdbFetch(`/genre/${mediaType}/list`);
  return data.genres || [];
}

export async function getTVSeasonDetails(tvId, seasonNumber) {
  return tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`);
}
