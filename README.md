# CineBrowse

CineBrowse is a frontend-only movie and TV browsing app built with Vite, React, JavaScript, Tailwind CSS, React Router, and the TMDB API. It focuses on a clean cinematic UI, reusable components, search, detail pages, genre browsing, and a dynamic `Watch Now` flow that points to backend embed routes.

## Stack

- Vite + React
- JavaScript
- Tailwind CSS
- React Router DOM
- Native `fetch`
- TMDB API

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.example`.

3. Add your TMDB Read Access Token to `.env`:

```env
VITE_TMDB_API_KEY=your_tmdb_read_access_token_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
VITE_BACKEND_BASE_URL=http://localhost:3000
```

4. Start the app:

```bash
npm run dev
```

## Available Routes

- `/`
- `/search`
- `/movie/:id`
- `/tv/:id`
- `/embed/movie/:tmdbId`
- `/embed/tv/:tmdbId/:season/:episode`

## TMDB Integration

The app uses TMDB for:

- Trending movies and TV
- Popular movies and TV
- Top rated movies and TV
- Movie and TV details
- Credits
- Videos
- Similar content
- Multi-search
- Genres
- TV season details

## TMDB Authentication

`VITE_TMDB_API_KEY` is used as a TMDB Bearer token, not as a query-string `api_key`.

Requests are sent from `src/api/tmdb.js` with:

```js
headers: {
  Accept: "application/json",
  Authorization: `Bearer ${TOKEN}`,
}
```

This means you should paste your TMDB Read Access Token directly into `.env` after copying from `.env.example`.

## Watch Now Logic

`Watch Now` is powered by `src/utils/getWatchRoute.js`.

- Movies navigate to `${VITE_BACKEND_BASE_URL}/embed/movie/{tmdbId}`
- TV shows navigate to `${VITE_BACKEND_BASE_URL}/embed/tv/{tmdbId}/{season}/{episode}`

Rules:

- Movies only need a TMDB id.
- TV shows require both season and episode.
- The helper safely supports both `item.media_type` and `item.mediaType`.
- The helper prefers `item.tmdbId` and falls back to `item.id`.
- Final navigation uses `window.location.assign(...)` because the embed URL is a backend URL.

## Backend Embed Notes

The project does not include backend logic. The frontend expects a backend player service to exist at `VITE_BACKEND_BASE_URL`.

Example backend routes:

- `http://localhost:3000/embed/movie/550`
- `http://localhost:3000/embed/tv/1399/1/1`

The frontend embed pages are included so the app has matching UI routes and can present the target route in a styled layout.

## Run Locally

```bash
npm install
npm run dev
```

## Project Structure

```text
src/
  api/
    tmdb.js
  components/
    CastList.jsx
    EmptyState.jsx
    ErrorMessage.jsx
    GenreList.jsx
    Hero.jsx
    Loader.jsx
    MediaCard.jsx
    MediaGrid.jsx
    Navbar.jsx
    SectionHeader.jsx
    TrailerSection.jsx
    WatchNowButton.jsx
  pages/
    EmbedMoviePage.jsx
    EmbedTVPage.jsx
    HomePage.jsx
    MovieDetailsPage.jsx
    SearchPage.jsx
    TVDetailsPage.jsx
  utils/
    formatMedia.js
    getWatchRoute.js
    image.js
  App.jsx
  main.jsx
```

## Beginner-Friendly Notes

- Shared TMDB requests live in one file: `src/api/tmdb.js`
- Card data is normalized by `src/utils/formatMedia.js`
- Image fallback logic lives in `src/utils/image.js`
- Watch route generation is kept separate in `src/utils/getWatchRoute.js`
- TV season and episode state is isolated in the TV details page for readability
