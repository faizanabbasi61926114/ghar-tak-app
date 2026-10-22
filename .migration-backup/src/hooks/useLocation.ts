
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Location } from '@/lib/types';

interface UseLocationReturn {
  location: Location | null;
  error: string | null;
  loading: boolean;
  refetchLocation: () => void;
}

// A default location (e.g., city center) for when permission is denied or fails.
const defaultLocation: Location = {
  lat: 30.3753, // Approx. center of Pakistan
  lng: 69.3451,
  address: 'Pakistan (Default Location)',
};

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLocation(defaultLocation);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // In a real app, you would use a Geocoding service here to get the address.
        const newLocation: Location = {
          lat: latitude,
          lng: longitude,
          address: 'Your Current Location'
        };
        setLocation(newLocation);
        setLoading(false);
      },
      (err) => {
        setError(`Could not get location. Showing results for a default area.`);
        setLocation(defaultLocation);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { location, error, loading, refetchLocation: fetchLocation };
}
