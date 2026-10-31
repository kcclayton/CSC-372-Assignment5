import React, { useEffect, useState } from "react";
import SearchForm from "./components/SearchForm.jsx";
import ShowGallery from "./components/ShowGallery.jsx";
import { searchShows } from "./tvmaze.js";

const DEFAULT_SEARCH = "Friends";
const MAX_DISPLAYED_RESULTS = 10;

// Page component: owns search state and connects the form to the gallery.
export default function App() {
  const [shows, setShows] = useState([]);
  const [status, setStatus] = useState("");
  const [hasError, setHasError] = useState(false);

  async function handleSearch(searchTerm) {
    setHasError(false);
    setStatus(`Searching for "${searchTerm}"...`);
    setShows([]);

    try {
      const results = await searchShows(searchTerm);
      const displayedResults = results.slice(0, MAX_DISPLAYED_RESULTS);
      setShows(displayedResults);
      setStatus(
        displayedResults.length
          ? `Showing ${displayedResults.length}${results.length > displayedResults.length ? ` of ${results.length}` : ""} shows for "${searchTerm}".`
          : `No shows found for "${searchTerm}".`,
      );
      return true;
    } catch (error) {
      console.error(error);
      setShows([]);
      setHasError(true);
      setStatus(
        error.status === 429
          ? "Too many searches right now. Please wait a moment and try again."
          : "Unable to load shows. Please try again.",
      );
      return false;
    }
  }

  useEffect(() => {
    handleSearch(DEFAULT_SEARCH);
  }, []);

  return (
    <>
      <header>
        <h1>TVmaze Gallery</h1>
      </header>

      <main>
        <SearchForm
          onSearch={handleSearch}
          status={status}
          hasError={hasError}
        />
        <ShowGallery shows={shows} />
      </main>

      <footer className="site-footer">
        <p>
          Powered by <a href="https://www.tvmaze.com/">TVmaze</a>.
        </p>
      </footer>
    </>
  );
}
