const TVMAZE_MIN_REQUEST_INTERVAL_MS = 500;
const TVMAZE_MAX_429_RETRIES = 2;
const TVMAZE_FALLBACK_RETRY_DELAY_MS = 5000;

let tvmazeRequestQueue = Promise.resolve();
let lastTvmazeRequestAt = 0;

// TVmaze API helpers: serialize requests and retry temporary rate limits.
export async function searchShows(searchTerm) {
  const response = await fetchTvmaze(
    `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchTerm)}`,
  );
  if (!response.ok) {
    const error = new Error(
      `TVmaze search failed with status ${response.status}.`,
    );
    error.status = response.status;
    throw error;
  }

  const results = await response.json();
  console.log("TVmaze search response:", results);
  return results.map(({ show }) => show);
}

export async function fetchShowCast(showId) {
  const response = await fetchTvmaze(
    `https://api.tvmaze.com/shows/${showId}/cast`,
  );
  if (!response.ok) {
    throw new Error(`TVmaze cast request failed with status ${response.status}.`);
  }
  return response.json();
}

export async function fetchShow(showId) {
  const response = await fetchTvmaze(
    `https://api.tvmaze.com/shows/${showId}`,
  );
  if (!response.ok) {
    throw new Error(`TVmaze show request failed with status ${response.status}.`);
  }
  return response.json();
}

function fetchTvmaze(url) {
  const request = tvmazeRequestQueue.then(async () => {
    await waitForTvmazeRequestSlot();

    let response = await fetch(url);
    lastTvmazeRequestAt = Date.now();

    for (
      let retry = 0;
      response.status === 429 && retry < TVMAZE_MAX_429_RETRIES;
      retry += 1
    ) {
      await delay(getRetryDelay(response, retry));
      await waitForTvmazeRequestSlot();
      response = await fetch(url);
      lastTvmazeRequestAt = Date.now();
    }

    return response;
  });

  tvmazeRequestQueue = request.then(
    () => undefined,
    () => undefined,
  );
  return request;
}

async function waitForTvmazeRequestSlot() {
  const waitTime =
    TVMAZE_MIN_REQUEST_INTERVAL_MS - (Date.now() - lastTvmazeRequestAt);
  if (waitTime > 0) {
    await delay(waitTime);
  }
}

function getRetryDelay(response, retry) {
  const retryAfter = response.headers.get("Retry-After");
  if (retryAfter) {
    const retryAfterSeconds = Number(retryAfter);
    if (Number.isFinite(retryAfterSeconds)) {
      return Math.max(0, retryAfterSeconds * 1000);
    }

    const retryAfterDate = Date.parse(retryAfter);
    if (Number.isFinite(retryAfterDate)) {
      return Math.max(0, retryAfterDate - Date.now());
    }
  }

  return TVMAZE_FALLBACK_RETRY_DELAY_MS * 2 ** retry;
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
