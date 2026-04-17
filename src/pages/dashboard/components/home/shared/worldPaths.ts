// Highly simplified world-silhouette path data. Each continent is a single
// hand-built path in equirectangular (lon,lat) space — plenty for the
// dashboard demo, where the map is a visual anchor for bubble markers.
// Keeping this static (no runtime dep) to honour the "nothing at runtime" rule.
//
// Coordinate convention: x = longitude (-180..180), y = -latitude (so +y is south
// on screen). Each path is a closed polygon with M...L...Z. Shapes are
// intentionally rough — exact geography is not the point, a global backdrop is.

export interface WorldContinentPath {
  id: string;
  name: string;
  d: string;
}

// NOTE: these are stylised silhouettes, not geographic boundaries.
// All coordinates are in (lon, -lat) space so the SVG viewBox can be
// e.g. "-180 -90 360 180" with no extra transform.
export const CONTINENT_PATHS: WorldContinentPath[] = [
  // North America (one blob)
  {
    id: "na",
    name: "North America",
    d: "M -165 -70 L -140 -72 L -125 -62 L -95 -55 L -75 -48 L -62 -45 L -55 -30 L -68 -22 L -80 -15 L -95 -15 L -100 -22 L -108 -30 L -115 -35 L -125 -38 L -140 -42 L -155 -55 L -165 -65 Z",
  },
  // Central America + Caribbean strand
  {
    id: "ca",
    name: "Central America",
    d: "M -102 -22 L -96 -18 L -88 -14 L -82 -10 L -78 -8 L -72 -12 L -80 -17 L -88 -20 L -98 -22 Z",
  },
  // South America
  {
    id: "sa",
    name: "South America",
    d: "M -78 -10 L -68 -4 L -58 -2 L -50 -6 L -42 -10 L -35 -8 L -38 5 L -45 20 L -55 35 L -65 45 L -72 55 L -75 50 L -72 35 L -75 20 L -80 10 L -78 -2 Z",
  },
  // Europe
  {
    id: "eu",
    name: "Europe",
    d: "M -10 -62 L 4 -65 L 18 -60 L 30 -58 L 42 -55 L 50 -50 L 45 -45 L 32 -42 L 20 -40 L 8 -42 L -2 -48 L -10 -54 Z",
  },
  // Africa
  {
    id: "af",
    name: "Africa",
    d: "M -18 -35 L -5 -34 L 10 -32 L 22 -30 L 35 -28 L 42 -20 L 48 -10 L 50 -2 L 48 5 L 42 15 L 34 25 L 24 33 L 16 35 L 8 32 L -2 25 L -8 15 L -14 5 L -18 -5 L -22 -18 L -20 -28 Z",
  },
  // Middle East (joined to African coast for simplicity)
  {
    id: "me",
    name: "Middle East",
    d: "M 32 -38 L 50 -38 L 58 -30 L 60 -22 L 54 -15 L 48 -12 L 42 -15 L 38 -22 L 34 -30 Z",
  },
  // Asia (big blob)
  {
    id: "as",
    name: "Asia",
    d: "M 40 -72 L 70 -78 L 100 -78 L 130 -72 L 155 -68 L 175 -58 L 178 -45 L 160 -38 L 140 -28 L 130 -20 L 120 -10 L 108 0 L 100 8 L 95 15 L 86 22 L 76 25 L 68 18 L 58 10 L 50 -2 L 44 -18 L 42 -35 L 40 -55 Z",
  },
  // South-East Asia island strand
  {
    id: "sea",
    name: "South-East Asia",
    d: "M 95 5 L 110 8 L 125 10 L 140 12 L 130 18 L 115 18 L 102 15 L 95 12 Z",
  },
  // Australia / Oceania
  {
    id: "au",
    name: "Australia",
    d: "M 112 20 L 130 18 L 148 22 L 155 32 L 150 38 L 135 40 L 120 38 L 112 32 Z",
  },
];

// Oman silhouette (anchor for the destination). Kept as an ellipse-ish blob.
export const OMAN_PATH =
  "M 54 -20 L 58 -22 L 60 -19 L 59 -15 L 56 -14 L 54 -16 Z";

// Optional per-country highlight paths. We do NOT use these now (bubbles
// carry the data) but the type is exported so we can wire them later
// without changing the WorldRiskMap signature.
export type CountryPathMap = Record<string, { name: string; d: string }>;
export const COUNTRY_PATHS: CountryPathMap = {};
