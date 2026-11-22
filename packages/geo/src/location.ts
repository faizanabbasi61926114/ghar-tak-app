// The customer-location rules the website and the mobile app share: how sure a location is,
// what is saved and how it is read back, what the map dialog saves, and the words customers read.
// Storage, permissions and drawing stay in each app; everything here is plain data in, data out.

import { formatDistance, type Coords } from './distance';

// ─── How sure a location is ──────────────────────────────────────────────────

// Locations vaguer than this (a computer locating itself by its internet connection, a phone
// with "precise location" off, or a picked city) don't filter the lists: everything is shown,
// nearest first, and the customer is asked to pin the right spot.
export const ROUGH_ACCURACY_M = 2000;

/** How vague a picked city counts as. It must stay above ROUGH_ACCURACY_M (a test checks). */
export const CITY_ACCURACY_M = 10000;

/** Whether a location is too vague to tell which shops reach it. Null (unknown) is not vague. */
export function isApproximate(accuracyM: number | null): boolean {
  return accuracyM !== null && accuracyM > ROUGH_ACCURACY_M;
}

/** City centres, so a customer can jump the map to their city before pinning their street. */
export const CITIES: (Coords & { name: string })[] = [
  { name: 'Lahore', lat: 31.5204, lng: 74.3587 },
  { name: 'Karachi', lat: 24.8607, lng: 67.0011 },
  { name: 'Islamabad', lat: 33.6844, lng: 73.0479 },
  { name: 'Rawalpindi', lat: 33.5651, lng: 73.0169 },
  { name: 'Faisalabad', lat: 31.4504, lng: 73.135 },
  { name: 'Multan', lat: 30.1575, lng: 71.5249 },
  { name: 'Peshawar', lat: 34.0151, lng: 71.5249 },
];

/** Where a map opens when there is no better guess: Lahore. */
export const DEFAULT_MAP_CENTER: Coords = { lat: CITIES[0].lat, lng: CITIES[0].lng };

// ─── The saved customer location ─────────────────────────────────────────────

/** Where the location came from: the device (GPS or Wi-Fi), or a spot or city the customer chose. */
export type LocationSource = 'device' | 'chosen';

export interface SavedLocation {
  point: Coords;
  source: LocationSource;
  /** How far off it may be, in metres. Null for a pin, or a device that didn't say: treated as precise. */
  accuracyM: number | null;
  /** The city the customer picked, when they picked a city rather than a spot. */
  place: string | null;
  savedAt: number;
}

/** How a location is being saved. A device reading kept as it was stays a device reading. */
export type SaveHow =
  | { source: 'device'; accuracyM: number | null }
  | { source: 'chosen'; accuracyM?: number | null; place?: string };

// After a day a device reading may be out of date (the customer moved), so it is asked again.
// A spot the customer chose stays until they change it.
export const MAX_DEVICE_LOCATION_AGE_MS = 24 * 60 * 60 * 1000;
// A phone whose clock ran ahead can save a time in the future, which would otherwise never age.
const MAX_CLOCK_AHEAD_MS = 5 * 60 * 1000;
const MAX_PLACE_LENGTH = 60;

const inRange = (value: unknown, limit: number): value is number =>
  typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= limit;

// Exactly 0,0 is what broken readings and mock providers report; no customer is there.
const isNullIsland = (lat: number, lng: number) => lat === 0 && lng === 0;

/**
 * Reads back a stored location (the JSON from serializeSavedLocation). Anything unusable counts
 * as nothing saved, so the device is asked again: out-of-range or 0,0 coordinates, an unknown
 * source (locations saved before pinning existed had none, and were often a laptop's guess).
 */
export function parseSavedLocation(raw: string | null | undefined): SavedLocation | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const { lat, lng, source, accuracyM, place, savedAt } = parsed as Record<string, unknown>;
  if (!inRange(lat, 90) || !inRange(lng, 180) || isNullIsland(lat, lng)) return null;
  if (source !== 'device' && source !== 'chosen') return null;
  const city = typeof place === 'string' && place.trim() ? place.trim().slice(0, MAX_PLACE_LENGTH) : null;
  return {
    point: { lat, lng },
    source,
    // A city is never a precise pin, even if its accuracy was lost.
    accuracyM: city ? CITY_ACCURACY_M : typeof accuracyM === 'number' && accuracyM >= 0 && Number.isFinite(accuracyM) ? accuracyM : null,
    place: city,
    savedAt: typeof savedAt === 'number' && Number.isFinite(savedAt) ? savedAt : 0,
  };
}

export function serializeSavedLocation(saved: SavedLocation): string {
  const { point, source, accuracyM, place, savedAt } = saved;
  return JSON.stringify({ lat: point.lat, lng: point.lng, source, accuracyM, ...(place ? { place } : {}), savedAt });
}

export function makeSavedLocation(point: Coords, how: SaveHow, now = Date.now()): SavedLocation {
  return {
    point: { lat: point.lat, lng: point.lng },
    source: how.source,
    accuracyM: how.accuracyM ?? null,
    place: how.source === 'chosen' ? (how.place ?? null) : null,
    savedAt: now,
  };
}

/**
 * Whether a device reading is too old to trust: older than a day, or saved with a clock that
 * was ahead. Such a reading is asked again; until then it is only "your last known location".
 */
export function isOutdated(saved: SavedLocation, now = Date.now()): boolean {
  if (saved.source !== 'device') return false;
  const age = now - saved.savedAt;
  return age > MAX_DEVICE_LOCATION_AGE_MS || age < -MAX_CLOCK_AHEAD_MS;
}

/**
 * Checks a position the device reported. Null when it can't be used: out of range, exactly 0,0,
 * or a negative accuracy (iOS's sign of an invalid fix). A missing accuracy is kept as null.
 * `coarse` is a phone allowed only its approximate location (Android "approximate", iOS
 * "precise location" off): its readings can be kilometres off whatever they report.
 */
export function deviceReading(
  lat: unknown,
  lng: unknown,
  accuracy: unknown,
  { coarse = false }: { coarse?: boolean } = {},
): { point: Coords; accuracyM: number | null } | null {
  if (!inRange(lat, 90) || !inRange(lng, 180) || isNullIsland(lat, lng)) return null;
  let accuracyM: number | null = null;
  if (typeof accuracy === 'number' && Number.isFinite(accuracy)) {
    if (accuracy < 0) return null;
    accuracyM = Math.round(accuracy);
  }
  if (coarse) accuracyM = Math.max(accuracyM ?? 0, ROUGH_ACCURACY_M + 1);
  return { point: { lat, lng }, accuracyM };
}

// ─── Choosing a spot on a map ────────────────────────────────────────────────

/** How the point under a map's pin got there, which decides how it is saved. */
export type PointOrigin =
  /** The map opened on the saved location and nobody has moved it. */
  | { kind: 'initial' }
  /** The customer moved the map; `viewKm` is how much ground the map showed (its shorter side). */
  | { kind: 'moved'; viewKm?: number }
  /** "Use my current location" placed it and the map hasn't been moved since. */
  | { kind: 'device'; accuracyM: number | null }
  /** A city button placed it and the map hasn't been moved since. */
  | { kind: 'jump'; city?: string };

// A pin dropped while the map shows more ground than this is a rough area, not a street:
// after a city jump, a small nudge must not turn the city centre into an exact spot.
export const PRECISE_VIEW_KM = 6;

/** What to save for the point under the pin, or null when nothing changed. */
export function locationToSave(origin: PointOrigin, point: Coords): { point: Coords; how: SaveHow } | null {
  switch (origin.kind) {
    case 'initial':
      return null;
    case 'device':
      return { point, how: { source: 'device', accuracyM: origin.accuracyM } };
    case 'jump':
      return { point, how: { source: 'chosen', accuracyM: CITY_ACCURACY_M, ...(origin.city ? { place: origin.city } : {}) } };
    case 'moved':
      if (origin.viewKm !== undefined && origin.viewKm > PRECISE_VIEW_KM) {
        // About half the ground on screen, so the lists treat it as "within about N km".
        return { point, how: { source: 'chosen', accuracyM: Math.round((origin.viewKm * 1000) / 2) } };
      }
      return { point, how: { source: 'chosen' } };
  }
}

/** Whether the map shows too much ground for a dragged pin to count as an exact spot. */
export const isWideView = (viewKm: number | undefined) => viewKm !== undefined && viewKm > PRECISE_VIEW_KM;

/**
 * How much ground a map should show around a saved location: a street for a precise one, more
 * for a vague one, so the customer opening the map can see their own area to pin it.
 */
export function viewKmFor(accuracyM: number | null): number {
  if (accuracyM === null || accuracyM <= 200) return 0.6;
  return Math.min(40, Math.max(0.6, (accuracyM * 2.5) / 1000));
}

/**
 * As the database keeps it: 7 decimals (about 1 cm), and the longitude wrapped into -180..180
 * (dragging past the edge of the world shows another copy of it).
 */
export function cleanPoint(point: Coords): Coords {
  const lng = ((((point.lng + 180) % 360) + 360) % 360) - 180;
  return { lat: Math.round(point.lat * 1e7) / 1e7, lng: Math.round(lng * 1e7) / 1e7 };
}

// ─── Words customers read ────────────────────────────────────────────────────

/** "2.3 km away", or "About 2.3 km away" when the customer's location is approximate. */
export function distanceText(km: number, approximate: boolean): string {
  return `${approximate ? 'About ' : ''}${formatDistance(km)} away`;
}

/** Why a distance is only "about": the picked city, or a vague location. */
export function approximateReason(place: string | null): string {
  return place ? `you picked ${place}` : 'your location is approximate';
}

/** The end of "Pin your location to check …" for a shop or a service. */
export function checkWhat(isService: boolean): string {
  return isService ? 'if it serves you' : 'delivery';
}

/**
 * "delivers to your location", or that the customer is outside the area. "just outside" when
 * the rounded distance would otherwise read as equal to the radius.
 */
export function reachVerdict(reach: { distanceKm: number; radiusKm: number; reaches: boolean }, isService: boolean): string {
  if (reach.reaches) return isService ? 'serves your location' : 'delivers to your location';
  const justOutside = reach.distanceKm - reach.radiusKm < 0.1;
  return `${justOutside ? 'just outside' : 'outside'} its ${reach.radiusKm} km ${isService ? 'service' : 'delivery'} area`;
}

export interface LocationSummaryInput {
  saved: SavedLocation | null;
  /** The first device request is still open. */
  loading: boolean;
  now?: number;
}

/**
 * The home banner: which location the lists are for, and the button that changes it.
 * `warn` marks the states that need the customer's help (unknown, approximate).
 */
export function locationSummary({ saved, loading, now = Date.now() }: LocationSummaryInput): {
  message: string;
  action: 'Set your location' | 'Pin your location' | 'Change';
  warn: boolean;
} {
  if (!saved) {
    return {
      message: loading
        ? 'Finding your location…'
        : "We don't know where you are, so every shop is shown. Set your location to see the ones that deliver to you.",
      action: 'Set your location',
      warn: !loading,
    };
  }
  if (isApproximate(saved.accuracyM)) {
    // Rounded up: "within about 2 km" would claim the precision the lists treat as exact.
    const km = Math.ceil((saved.accuracyM ?? 0) / 1000);
    return {
      message: saved.place
        ? `Showing every shop, nearest to ${saved.place} first. Pin your street to see the ones that deliver to you.`
        : `Your location is only approximate (within about ${km} km), so every shop is shown, nearest first. Pin your location to see the ones that deliver to you.`,
      action: 'Pin your location',
      warn: true,
    };
  }
  if (saved.source === 'chosen') {
    return { message: 'Showing the shops that deliver to the spot you pinned.', action: 'Change', warn: false };
  }
  return {
    // A reading the device couldn't refresh is still used, but not called current.
    message: isOutdated(saved, now)
      ? 'Showing the shops that deliver to your last known location.'
      : 'Showing the shops that deliver to your current location.',
    action: 'Change',
    warn: false,
  };
}

/** The line under the list title when the location is approximate. */
export function approximateListNote(place: string | null): string {
  return place
    ? `You picked ${place}, so everything is shown, nearest first.`
    : 'Your location is only approximate, so everything is shown, nearest first.';
}

/** What "Use my current location" says about the reading it placed. */
export function accuracyNote(metres: number | null, { hasMap = true }: { hasMap?: boolean } = {}): string {
  if (metres === null || metres === 0) {
    return hasMap ? 'Placed at your current location. Check that the pin is on the right spot.' : 'Found your current location.';
  }
  if (metres > 100) {
    const within = metres >= 1000 ? `${(metres / 1000).toFixed(1)} km` : `${metres} m`;
    return `Your device only knows this to within about ${within}.${hasMap ? ' Move the map so the pin sits exactly on the right spot.' : ''}`;
  }
  return `Placed to within about ${metres} m.${hasMap ? ' Check that the pin is on the right spot.' : ''}`;
}
