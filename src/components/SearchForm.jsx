import React, { useState } from "react";

// SearchForm component: validates input and reports search requests to App.
export default function SearchForm({
  initialSearchTerm,
  onSearch,
  status,
  hasError,
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    if (!trimmedSearchTerm) {
      return;
    }
    onSearch(trimmedSearchTerm);
    onSearch(trimmedSearchTerm);
  }

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit}>
      <label htmlFor="gallery-search">Search the gallery</label>
      <div className="search-controls">
        <input
          id="gallery-search"
          name="q"
          type="search"
          required
          placeholder="Enter a search term"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button type="submit">Search</button>
      </div>
      <p
        className={`search-status${hasError ? " search-status--error" : ""}`}
        role="status"
        aria-live="polite"
      >
        {status}
      </p>
    </form>
  );
}
