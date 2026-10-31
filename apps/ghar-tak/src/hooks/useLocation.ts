import { useState, useEffect, useCallback } from 'react';
import type { Location } from '@/lib/types';

const STORAGE_KEY = 'ghar-tak:user-location';
const LOCATION_EVENT = 'ghar-tak:location-change';
const DEFAULT_ADDRESS = 'Pakistan (Default Location)';

interface UseLocationReturn {
  location: Location | null;
  error: string | null;
  loading: boolean;
  hasRealLocation: boolean;
  refetchLocation: () => void;
}

// A default location (e.g., city center) for when permission is denied or fails.
const defaultLocation: Location = {
  lat: 30.3753, // Approx. center of Pakistan
  lng: 69.3451,
  address: DEFAULT_ADDRESS,
};

function readStoredLocation(): Location | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Location>;
    if (typeof parsed.lat !== 'number' || typeof parsed.lng !== 'number') return null;
    return {
      lat: parsed.lat,
      lng: parsed.lng,
      address: parsed.address || 'Your Current Location',
    };
  } catch {
    return null;
  }
}

function persistLocation(location: Location) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch {
    // Storage can be unavailable (private mode, quota) — the in-memory cache still works.
  }
}

let cachedLocation: Location | null = readStoredLocation();
let pendingRequest: Promise<Location | null> | null = null;

function requestBrowserLocation(): Promise<Location | null> {
  // Share a single permission prompt / in-flight request across all consumers.
  if (pendingRequest) return pendingRequest;

  pendingRequest = new Promise<Location | null>((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: 'Your Current Location',
        };
        cachedLocation = location;
        persistLocation(location);
        window.dispatchEvent(new CustomEvent<Location>(LOCATION_EVENT, { detail: location }));
        resolve(location);
      },
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  }).finally(() => {
    pendingRequest = null;
  });

  return pendingRequest;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<Location | null>(cachedLocation);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(cachedLocation === null);

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await requestBrowserLocation();
    if (result) {
      setLocation(result);
    } else {
      setError(
        cachedLocation
          ? 'Could not refresh your location. Showing your last known area.'
          : 'Could not get location. Showing results for a default area.',
      );
      if (!cachedLocation) setLocation(defaultLocation);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const onLocationChange = (event: Event) => {
      const detail = (event as CustomEvent<Location>).detail;
      if (!detail) return;
      setLocation(detail);
      setError(null);
      setLoading(false);
    };

    window.addEventListener(LOCATION_EVENT, onLocationChange);
    if (!cachedLocation) void fetchLocation();

    return () => window.removeEventListener(LOCATION_EVENT, onLocationChange);
  }, [fetchLocation]);

  return {
    location,
    error,
    loading,
    hasRealLocation: location !== null && location.address !== DEFAULT_ADDRESS,
    refetchLocation: fetchLocation,
  };
}
