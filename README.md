# TVmaze Gallery

A responsive React single-page TV show search gallery built with Vite. It uses the [TVmaze API](https://www.tvmaze.com/api) to find shows and present their details.

## Features

- Searches TVmaze and displays up to 10 relevant results in a responsive Flexbox gallery.
- Shows each result's poster, summary, genres, average rating, premiere/end dates, last-updated date, cast, and TVmaze link.
- Loads up to five cast members per gallery card and up to 15 on the detail page.
- Links each show title to a detail page with its status and network or streaming channel when available.
- Handles empty searches, no results, request errors, missing data, unavailable posters, and API rate limiting with clear messages or fallbacks.
- Spaces TVmaze requests, retries rate-limited responses a limited number of times, and caches cast responses to avoid unnecessary requests.
- Supports keyboard-visible focus states.
- Uses React Router so searches are addressable at `/search/:searchTerm`; `/` redirects to the default Friends search.
- Loads show details directly from TVmaze at `/shows/:showId`, including on a direct visit or page refresh. The detail page links back to the originating search when available.

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
- `src/components/SearchForm.jsx` — controlled search form and empty-input validation.
- `src/components/ShowGallery.jsx` — result count, request states, and responsive show list.
- `src/components/ShowCard.jsx` — show information and per-card cast request.
- `src/components/ShowDetailPage.jsx` — route-driven detail fetch and detail-page states.
- `src/tvmaze.js` — TVmaze requests, queueing, and rate-limit retries.
- `src/utils.js` — shared API-value fallbacks and display formatters.
- `style.css` — responsive gallery and card styling.

Show data is provided by TVmaze. See the attribution link in the page footer.

## React concepts

| # | React concept | Where it appears |
|---|---|---|
| 1 | Component-based UI, with each component in its own file | `src/App.jsx`, `src/components/` |
| 2 | Controlled form input and submit handling with `preventDefault()` | `src/components/SearchForm.jsx` |
| 3 | Component state with `useState` | `src/App.jsx`, `src/components/SearchForm.jsx`, `src/components/ShowCard.jsx`, `src/components/ShowDetailPage.jsx` |
| 4 | API fetching and request lifecycle with `useEffect` | `src/App.jsx`, `src/components/ShowCard.jsx`, `src/components/ShowDetailPage.jsx` |
| 5 | Rendering API results with `map()` and stable keys | `src/components/ShowGallery.jsx`, `src/components/ShowCard.jsx` |
| 6 | Shared search and results state lifted to a common parent | `src/App.jsx`, `src/components/SearchForm.jsx`, `src/components/ShowGallery.jsx` |
| 7 | Client-side routing, URL parameters, and show detail fetches | `src/main.jsx`, `src/App.jsx`, `src/components/ShowDetailPage.jsx` |
| 8 | Conditional loading, error, empty, and results UI | `src/components/ShowGallery.jsx`, `src/components/ShowDetailPage.jsx`, `src/components/ShowCard.jsx` |

## Reflection

Moving from vanilla JavaScript to React made the interface easier to organize because the search form, gallery, and show cards each have a clear responsibility. React handles updating the page when data changes, so I no longer need to manually create elements, replace list contents, or attach DOM event listeners. The harder part was coordinating asynchronous requests and UI states: effects must respond to the right route or show ID, ignore results after a component unmounts, and keep a failed cast request from disrupting the gallery. React Router required treating the URL as the source for searches and show details.

Search results, the active search term, loading status, and request errors live in `App`, which is the common parent of the search form and gallery. This lets both child components stay synchronized without duplicating search state. The input value and its validation message live in `SearchForm` because they only affect that form. Each `ShowCard` owns its cast response and poster fallback because those values belong to that individual card. The show detail page owns its separately fetched show and request state. Keeping state near the components that need it makes updates predictable while lifting only shared state to the parent.
