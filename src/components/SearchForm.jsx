import React, { useState } from "react";

// SearchForm component: validates input and reports search requests to App.
export default function SearchForm({
  initialSearchTerm,
  onSearch,
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [validationError, setValidationError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    if (!trimmedSearchTerm) {
      setValidationError("Enter a show title or keyword before searching.");
      return;
    }
    setValidationError("");
    onSearch(trimmedSearchTerm);
  }

  function handleChange(event) {
    setSearchTerm(event.target.value);
    if (validationError) {
      setValidationError("");
    }
  }

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit}>
      <label htmlFor="gallery-search">Search the gallery</label>
      <div className="search-controls">
        <input
          id="gallery-search"
          name="q"
          type="search"
          placeholder="Enter a search term"
          value={searchTerm}
          onChange={handleChange}
          aria-invalid={Boolean(validationError)}
          aria-describedby={validationError ? "search-validation" : undefined}
        />
        <button type="submit">Search</button>
      </div>
      {validationError && (
        <p
          id="search-validation"
          className="search-status search-status--error"
          role="alert"
        >
          {validationError}
        </p>
      )}
    </form>
  );
}
