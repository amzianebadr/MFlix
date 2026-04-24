const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

const svgPlaceholder = (label) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900">
      <rect width="600" height="900" fill="#111111"/>
      <rect x="26" y="26" width="548" height="848" rx="28" fill="#161616" stroke="#2a2a2a"/>
      <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="#FFDE21" font-size="42" font-family="Arial, sans-serif">${label}</text>
      <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" fill="#BFBFBF" font-size="22" font-family="Arial, sans-serif">CineBrowse</text>
    </svg>`,
  )}`;

export function buildImageUrl(path, size = 'w500') {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

export function getPosterUrl(path) {
  return buildImageUrl(path, 'w500') || svgPlaceholder('No Poster');
}

export function getBackdropUrl(path) {
  return buildImageUrl(path, 'w1280') || svgPlaceholder('No Backdrop');
}
