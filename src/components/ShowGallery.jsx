import React from "react";
import ShowCard from "./ShowCard.jsx";

// ShowGallery component: presents the search results as an accessible list.
export default function ShowGallery({ shows, loading, error }) {
  return (
    <section aria-labelledby="gallery-heading">
      <h2 id="gallery-heading">Gallery</h2>
      <ul className="gallery" aria-label="Gallery results">
        {loading ? (
          <li>Loading shows...</li>
        ) : error ? null : shows.length ? (
          shows.map((show) => (
            <li key={show.id}>
              <ShowCard show={show} />
            </li>
          ))
        ) : (
          <li>No shows found. Try another search.</li>
        )}
      </ul>
    </section>
  );
}
