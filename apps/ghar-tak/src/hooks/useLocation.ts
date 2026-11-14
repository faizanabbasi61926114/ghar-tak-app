import { useEffect, useSyncExternalStore } from 'react';
import {
  deviceReading,
  isOutdated,
  makeSavedLocation,
  parseSavedLocation,
  serializeSavedLocation,
  type Coords,
  type LocationSource,
  type SavedLocation,
  type SaveHow,
} from '@workspace/geo';

// The customer's location, one store for every component. The rules for what is saved and
// how it is read back live in @workspace/geo, shared with the mobile app.

const STORAGE_KEY = 'ghar-tak:user-location';

/** locating: the first device request is still open. ready: a location is known. failed: none is known. */
type LocationStatus = 'locating' | 'ready' | 'failed';

interface LocationState {
  saved: SavedLocation | null;
  status: LocationStatus;
}

// The browser's own timeout doesn't count the time its permission prompt stays open, so a
// customer who ignores the prompt would wait forever. After this the location counts as
// unknown; an answer that comes later is still used.
const PROMPT_WAIT_MS = 10000;

interface UseLocationReturn {
  location: Coords | null;
  saved: SavedLocation | null;
  source: LocationSource | null;
  accuracyM: number | null;
  place: string | null;
  loading: boolean;
  hasRealLocation: boolean;
  chooseLocation: (point: Coords, how: SaveHow) => void;
  /** Forgets the saved location on this browser (a shared computer, say). */
  forgetLocation: () => void;
}

function readSaved(): SavedLocation | null {
  try {
    return parseSavedLocation(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

const initial = readSaved();
let state: LocationState = { saved: initial, status: initial ? 'ready' : 'locating' };
const listeners = new Set<() => void>();

function setState(next: Partial<LocationState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;

function save(point: Coords, how: SaveHow) {
  const saved = makeSavedLocation(point, how);
  try {
    localStorage.setItem(STORAGE_KEY, serializeSavedLocation(saved));
  } catch {
    // Storage can be unavailable (private mode, quota): the in-memory copy still works.
  }
  setState({ saved, status: 'ready' });
}

function forgetLocation() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to remove where storage is unavailable.
  }
  setState({ saved: null, status: 'failed' });
}

// Another tab saved or cleared the location: use the same one here.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    const saved = readSaved();
    setState(saved ? { saved, status: 'ready' } : { saved: null, status: state.status === 'locating' ? 'locating' : 'failed' });
  });
}

/** Asks the browser where the device is. It never replaces a spot the customer chose. */
function requestDeviceLocation() {
  const waiting = !state.saved;
  const fail = () => {
    // A refresh that fails keeps the old location on screen.
    if (!state.saved) setState({ status: 'failed' });
  };
  if (!navigator.geolocation) {
    fail();
    return;
  }
  if (waiting) setState({ status: 'locating' });
  const giveUp = waiting
    ? setTimeout(() => {
        if (state.status === 'locating') setState({ status: 'failed' });
      }, PROMPT_WAIT_MS)
    : undefined;

  try {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(giveUp);
        // A spot chosen meanwhile, here or in another tab, wins over the device.
        const chosen = [readSaved(), state.saved].find((saved) => saved?.source === 'chosen');
        if (chosen) {
          setState({ saved: chosen, status: 'ready' });
          return;
        }
        const reading = deviceReading(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
        if (!reading) {
          fail();
          return;
        }
        save(reading.point, { source: 'device', accuracyM: reading.accuracyM });
      },
      () => {
        clearTimeout(giveUp);
        fail();
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  } catch {
    // Some in-app browsers throw instead of calling the error callback.
    clearTimeout(giveUp);
    fail();
  }
}

// The device is asked by itself at most once per page session: a customer who ignored or
// refused the prompt isn't asked again on every page, and an outdated reading is refreshed once.
// Only their own action (the location dialog) asks again after that.
let askedAutomatically = false;

function locateAutomatically() {
  if (askedAutomatically) return;
  const { saved } = state;
  if (saved && !isOutdated(saved)) return;
  askedAutomatically = true;
  requestDeviceLocation();
}

export function useLocation(): UseLocationReturn {
  const { saved, status } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(locateAutomatically, []);

  return {
    location: saved?.point ?? null,
    saved,
    source: saved?.source ?? null,
    accuracyM: saved?.accuracyM ?? null,
    place: saved?.place ?? null,
    loading: status === 'locating',
    hasRealLocation: saved !== null,
    chooseLocation: save,
    forgetLocation,
  };
}
