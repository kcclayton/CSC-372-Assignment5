import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchShowCast } from "../tvmaze.js";

// ShowCard component: renders show details and asynchronously loaded cast.
export default function ShowCard({ show, isDetailPage = false }) {
  const location = useLocation();
  const [cast, setCast] = useState(null);
  const [castError, setCastError] = useState("");
  const [posterUnavailable, setPosterUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    fetchShowCast(show.id)
      .then((showCast) => {
        if (active) {
          setCast(showCast);
        }
      })
      .catch((error) => {
        console.error(`Unable to load cast for "${show.name}".`, error);
        if (active) {
          setCast([]);
          setCastError(
            error.status === 429
              ? "TVmaze rate limit reached. Cast is temporarily unavailable; please try again later."
              : "Cast is currently unavailable.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [show.id, show.name]);

  const summary = show.summary ? displayValue(stripHtmlMarkup(show.summary)) : "";
  const posterUrl =
    typeof show.image?.medium === "string" ? show.image.medium.trim() : "";

  return (
    <article className="show-card">
      {posterUrl && !posterUnavailable ? (
        <img
          className="show-card__image"
          src={posterUrl}
          alt={`Poster for ${displayValue(show.name)}`}
          loading="lazy"
          onError={() => setPosterUnavailable(true)}
        />
      ) : (
        <div
          className="show-card__image show-card__image--placeholder"
          role="img"
          aria-label="Poster unavailable"
        >
          Poster unavailable
        </div>
      )}
      <h3 className="show-card__title">
        {isDetailPage ? (
          displayValue(show.name)
        ) : (
          <Link
            to={`/shows/${show.id}`}
            state={{ from: location.pathname }}
          >
            {displayValue(show.name)}
          </Link>
        )}
      </h3>
      <p className="show-card__summary">{summary || "Not available"}</p>
      <ShowDetail
        label="Genres"
        value={
          show.genres?.length
            ? show.genres.map(displayValue).join(", ")
            : "Not available"
        }
      />
      <ShowDetail
        label="Average rating"
        value={formatRating(show.rating?.average)}
      />
      <div className="show-card__dates">
        <ShowDetail
          label="Premiere date"
          value={displayValue(show.premiered)}
        />
        {show.ended && <ShowDetail label="End date" value={show.ended} />}
      </div>
      <ShowDetail label="Last updated" value={formatUpdatedDate(show.updated)} />
      {isDetailPage && (
        <>
          <ShowDetail label="Status" value={show.status} />
          <ShowDetail
            label="Network or streaming channel"
            value={show.network?.name ?? show.webChannel?.name}
          />
        </>
      )}
      <section className="show-card__cast">
        <h4>Cast</h4>
        <ul className="show-card__cast-list">
          {cast === null ? (
            <li>Loading cast...</li>
          ) : castError ? (
            <li>{castError}</li>
          ) : cast.length ? (
            cast.slice(0, isDetailPage ? 15 : 5).map(({ person, character }) => {
              const personName = displayValue(person?.name);
              const characterName = displayValue(character?.name);
              return (
                <li
                  key={`${person?.id ?? personName}-${character?.id ?? characterName}`}
                >
                  {characterName === "Not available"
                    ? personName
                    : `${personName} as ${characterName}`}
                </li>
              );
            })
          ) : (
            <li>Not available</li>
          )}
        </ul>
      </section>
      {show.url && (
        <a className="show-card__link" href={show.url}>
          View on TVmaze
        </a>
      )}
    </article>
  );
}

// ShowCard helpers: format API values for readable text.
function ShowDetail({ label, value }) {
  return (
    <p className="show-card__detail">
      <strong>{label}: </strong>
      {displayValue(value)}
    </p>
  );
}

function displayValue(value) {
  if (value == null) {
    return "Not available";
  }
  const text = String(value).trim();
  return text || "Not available";
}

function stripHtmlMarkup(html) {
  return new DOMParser()
    .parseFromString(html, "text/html")
    .body.textContent.trim();
}

function formatRating(average) {
  return typeof average === "number" && Number.isFinite(average)
    ? `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(average)} / 10`
    : "Not available";
}

function formatUpdatedDate(updated) {
  if (typeof updated !== "number" || !Number.isFinite(updated)) {
    return "Not available";
  }

  const updatedDate = new Date(updated * 1000);
  if (Number.isNaN(updatedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(updatedDate);
}
