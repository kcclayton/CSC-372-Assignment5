import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ShowCard from "./ShowCard.jsx";
import { fetchShow } from "../tvmaze.js";

// ShowDetailPage component: loads a show from its URL parameter.
export default function ShowDetailPage() {
  const { showId } = useParams();
  const location = useLocation();
  const galleryPath =
    typeof location.state?.from === "string" &&
    location.state.from.startsWith("/search/")
      ? location.state.from
      : "/search/Friends";
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setShow(null);
    setLoading(true);
    setError("");

    if (!/^[1-9]\d*$/.test(showId ?? "")) {
      setError("That show ID is invalid. Return to the gallery and choose a show.");
      setLoading(false);
      return () => {
        active = false;
      };
    }

    fetchShow(showId)
      .then((showData) => {
        if (active) {
          setShow(showData);
        }
      })
      .catch((requestError) => {
        console.error(requestError);
        if (active) {
          setError(
            requestError.status === 404
              ? "No show was found with that ID. Return to the gallery and choose another show."
              : "Unable to load this show right now. Check your connection and try again.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [showId]);

  return (
    <>
      <header>
        <h1>TVmaze Gallery</h1>
      </header>
      <main className="show-detail-page">
        <p>
          <Link to={galleryPath}>Back to gallery</Link>
        </p>
        <section aria-labelledby="show-detail-heading">
          <h2 id="show-detail-heading">Show details</h2>
          {loading ? (
            <p role="status">Loading show...</p>
          ) : error ? (
            <p className="search-status search-status--error" role="alert">
              {error}
            </p>
          ) : (
            <ul className="gallery" aria-label="Show details">
              <li>
                <ShowCard show={show} isDetailPage />
              </li>
            </ul>
          )}
        </section>
      </main>
      <footer className="site-footer">
        <p>
          Powered by <a href="https://www.tvmaze.com/">TVmaze</a>.
        </p>
      </footer>
    </>
  );
}
