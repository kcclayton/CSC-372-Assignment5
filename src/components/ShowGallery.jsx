import React from "react";
import ShowCard from "./ShowCard.jsx";

// ShowGallery component: presents the search results as an accessible list.
export default function ShowGallery({
  shows,
  loading,
  error,
  isEmptySearch,
  searchTerm,
  totalResults,
}) {
  return (
    <section aria-labelledby="gallery-heading">
      <h2 id="gallery-heading">Gallery</h2>
      {loading ? (
        <p role="status">Loading shows...</p>
      ) : error ? (
        <p className="search-status search-status--error" role="alert">
          {error}
        </p>
      ) : isEmptySearch ? (
        <p role="status">Enter a show title or keyword to search the gallery.</p>
      ) : shows.length === 0 ? (
        <p role="status">No shows found for "{searchTerm}". Try another search.</p>
      ) : (
        <>
          <p role="status" aria-live="polite">
            Showing {shows.length}
            {totalResults > shows.length ? ` of ${totalResults}` : ""}{" "}
            {shows.length === 1 ? "show" : "shows"} for "{searchTerm}".
          </p>
          <ul className="gallery" aria-label="Gallery results">
            {shows.map((show) => (
              <li key={show.id}>
                <ShowCard show={show} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
