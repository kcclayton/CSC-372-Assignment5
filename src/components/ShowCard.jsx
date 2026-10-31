import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchShowCast } from "../tvmaze.js";

// ShowCard component: renders show details and asynchronously loaded cast.
export default function ShowCard({ show, isDetailPage = false }) {
  const [cast, setCast] = useState(null);
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
        }
      });

    return () => {
      active = false;
    };
  }, [show.id, show.name]);

  const summary = show.summary ? stripHtmlMarkup(show.summary) : "";

  return (
    <article className="show-card">
      {show.image?.medium && !posterUnavailable ? (
        <img
          className="show-card__image"
          src={show.image.medium}
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
          <Link to={`/shows/${show.id}`}>{displayValue(show.name)}</Link>
        )}
      </h3>
      <p className="show-card__summary">{summary || "Not available"}</p>
      {show.genres?.length > 0 && (
        <ShowDetail
          label="Genres"
          value={show.genres.map(displayValue).join(", ")}
        />
      )}
      {typeof show.rating?.average === "number" &&
        Number.isFinite(show.rating.average) && (
          <ShowDetail
            label="Average rating"
            value={formatRating(show.rating.average)}
          />
        )}
      <div className="show-card__dates">
        {show.premiered && (
          <ShowDetail label="Premiere date" value={show.premiered} />
        )}
        {show.ended && <ShowDetail label="End date" value={show.ended} />}
      </div>
      <ShowDetail label="Last updated" value={formatUpdatedDate(show.updated)} />
      <section className="show-card__cast">
        <h4>Cast</h4>
        <ul className="show-card__cast-list">
          {cast === null ? (
            <li>Loading cast...</li>
          ) : cast.length ? (
            cast.slice(0, 5).map(({ person, character }) => (
              <li
                key={`${person?.id ?? person?.name}-${character?.id ?? character?.name}`}
              >
                {displayValue(person?.name)} as {displayValue(character?.name)}
              </li>
            ))
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
  return value == null ? "Not available" : String(value);
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
