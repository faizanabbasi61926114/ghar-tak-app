import { useState, useEffect, useCallback } from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, hasFirebaseConfig } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ASYNC_STORAGE_KEY = "ghar_tak_guest_favourites";

async function loadLocalFavourites(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch { /* ignore */ }
  return new Set();
}

async function saveLocalFavourites(ids: Set<string>) {
  try {
    await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify([...ids]));
  } catch { /* ignore */ }
}

export function useFavorites() {
  const { user, isGuest } = useAuth();
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setFavouriteIds(new Set());
      return;
    }

    if (isGuest || !hasFirebaseConfig || !db) {
      loadLocalFavourites().then(setFavouriteIds);
      return;
    }

    const favRef = collection(db, "users", user.uid, "favourites");
    const unsubscribe = onSnapshot(
      favRef,
      (snapshot) => {
        const ids = new Set<string>();
        snapshot.forEach((d) => ids.add(d.id));
        setFavouriteIds(ids);
      },
      () => {
        loadLocalFavourites().then(setFavouriteIds);
      }
    );

    return () => unsubscribe();
  }, [user, isGuest]);

  const toggleFavourite = useCallback(
    async (storeId: string) => {
      if (!user) return;

      const isFav = favouriteIds.has(storeId);

      if (isGuest || !hasFirebaseConfig || !db) {
        const next = new Set(favouriteIds);
        if (isFav) next.delete(storeId);
        else next.add(storeId);
        setFavouriteIds(next);
        await saveLocalFavourites(next);
        return;
      }

      const docRef = doc(db, "users", user.uid, "favourites", storeId);
      try {
        if (isFav) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { storeId, addedAt: serverTimestamp() });
        }
      } catch (err) {
        console.error("Failed to toggle favourite:", err);
      }
    },
    [user, isGuest, favouriteIds]
  );

  return { favouriteIds, toggleFavourite };
}
