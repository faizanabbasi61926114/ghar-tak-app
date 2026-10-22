import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/react';

const KEY_PREFIX = 'ghar_tak_favourites';

function storageKey(userId: string | null | undefined) {
  return userId ? `${KEY_PREFIX}_${userId}` : `${KEY_PREFIX}_guest`;
}

function loadFavourites(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch { /* ignore */ }
  return new Set();
}

function saveFavourites(key: string, ids: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...ids]));
  } catch { /* ignore */ }
}

export function useFavorites() {
  const { user } = useUser();
  const key = storageKey(user?.id);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(() => loadFavourites(key));

  useEffect(() => {
    setFavouriteIds(loadFavourites(key));
  }, [key]);

  const toggleFavourite = useCallback(
    (providerId: string) => {
      setFavouriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(providerId)) next.delete(providerId);
        else next.add(providerId);
        saveFavourites(key, next);
        return next;
      });
    },
    [key],
  );

  return { favouriteIds, toggleFavourite };
}
