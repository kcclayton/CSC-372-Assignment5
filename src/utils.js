// Display helpers: normalize API values and format show data for the UI.
export function displayValue(value) {
  if (value == null) {
    return "Not available";
  }
  const text = String(value).trim();
  return text || "Not available";
}

export function stripHtmlMarkup(html) {
  return new DOMParser()
    .parseFromString(html, "text/html")
    .body.textContent.trim();
}

export function formatRating(average) {
  return typeof average === "number" && Number.isFinite(average)
    ? `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(average)} / 10`
    : "Not available";
}

export function formatUpdatedDate(updated) {
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
