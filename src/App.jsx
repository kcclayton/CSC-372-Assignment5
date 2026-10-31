import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchForm from "./components/SearchForm.jsx";
import ShowGallery from "./components/ShowGallery.jsx";
import { searchShows } from "./tvmaze.js";

const DEFAULT_SEARCH = "Friends";
const MAX_DISPLAYED_RESULTS = 10;

// Page component: owns search state and connects the form to the gallery.
export default function App() {
  const { searchTerm = DEFAULT_SEARCH } = useParams();
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalResults, setTotalResults] = useState(0);

  function handleSearch(nextSearchTerm) {
    navigate(`/search/${encodeURIComponent(nextSearchTerm)}`);
  }

  useEffect(() => {
    let active = true;

    if (!searchTerm.trim()) {
      setLoading(false);
      setError("");
      setShows([]);
      setTotalResults(0);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError("");
    setShows([]);
    setTotalResults(0);

    async function loadShows() {
      try {
        const results = await searchShows(searchTerm);
        if (!active) {
          return;
        }

        const displayedResults = results.slice(0, MAX_DISPLAYED_RESULTS);
        setShows(displayedResults);
        setTotalResults(results.length);
      } catch (requestError) {
        console.error(requestError);
        if (!active) {
          return;
        }

        setShows([]);
        setError(
          requestError.status === 429
            ? "Too many searches right now. Please wait a moment and try again."
            : "Unable to load shows. Please try again.",
        );
        setTotalResults(0);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadShows();
    return () => {
      active = false;
    };
  }, [searchTerm]);

  return (
    <>
      <header>
        <h1>TVmaze Gallery</h1>
      </header>

      <main>
        <SearchForm
          key={searchTerm}
          initialSearchTerm={searchTerm}
          onSearch={handleSearch}
        />
        <ShowGallery
          shows={shows}
          loading={loading}
          error={error}
          isEmptySearch={!searchTerm.trim()}
          searchTerm={searchTerm}
          totalResults={totalResults}
        />
      </main>

      <footer className="site-footer">
        <p>
          Powered by <a href="https://www.tvmaze.com/">TVmaze</a>.
        </p>
      </footer>
    </>
  );
}
