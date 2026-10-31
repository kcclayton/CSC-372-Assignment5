# TVmaze Gallery

A responsive React single-page TV show search gallery built with Vite. It uses the [TVmaze API](https://www.tvmaze.com/api) to find shows and present their details.

## Features

- Searches TVmaze and displays up to 10 relevant results.
- Builds a card for each show with its poster, summary, genres, rating, premiere and end dates, last-updated date, and TVmaze link.
- Loads up to five main cast members per show, showing a placeholder while cast data loads or when it is unavailable.
- Handles missing poster images, failed requests, and API rate limiting.
- Uses a responsive grid layout and supports keyboard-visible focus states.
- Uses React Router so searches are addressable at `/search/:searchTerm`; `/` redirects to the default Friends search.
- Links each show title to `/shows/:showId`, where the show details are loaded directly from TVmaze.

## Run locally

Install dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, or serve that build locally with `npm run preview`. An internet connection is required to retrieve show and cast data from TVmaze.

## Project structure

- `index.html` — Vite document and React mount point.
- `src/main.jsx` — React application entry point.
- `src/App.jsx` — routed search state, page layout, and status messages.
- `src/components/` — search form, gallery, and show card components.
- `src/tvmaze.js` — TVmaze requests, queueing, and rate-limit retries.
- `style.css` — responsive gallery and card styling.

Show data is provided by TVmaze. See the attribution link in the page footer.
