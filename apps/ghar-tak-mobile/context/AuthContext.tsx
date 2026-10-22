import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

import { auth, hasFirebaseConfig } from "@/lib/firebase";

interface GuestUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isGuest: true;
}

export type AppUser = FirebaseUser | GuestUser;

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  firebaseReady: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  guestSignIn: () => void;
  isGuest: boolean;
}

const GUEST_USER_KEY = 'ghar_tak_guest_user';

function createGuestUser(): GuestUser {
  return {
    uid: `guest-${Date.now()}`,
    email: 'guest@ghartak.app',
    displayName: 'Guest',
    photoURL: null,
    isGuest: true,
  };
}

function loadGuestUser(): GuestUser | null {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(GUEST_USER_KEY) : null;
    if (raw) return JSON.parse(raw) as GuestUser;
  } catch { /* ignore */ }
  return null;
}

function saveGuestUser(user: GuestUser | null) {
  try {
    if (typeof localStorage !== 'undefined') {
      if (user) localStorage.setItem(GUEST_USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(GUEST_USER_KEY);
    }
  } catch { /* ignore */ }
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  firebaseReady: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  guestSignIn: () => {},
  isGuest: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const guest = loadGuestUser();
    if (guest) {
      setUser(guest);
      setLoading(false);
      return;
    }
    if (!hasFirebaseConfig || !auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!hasFirebaseConfig || !auth) {
      throw new Error("Firebase is not configured. Please set EXPO_PUBLIC_FIREBASE_* environment variables.");
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    if (!hasFirebaseConfig || !auth) {
      throw new Error("Firebase is not configured. Please set EXPO_PUBLIC_FIREBASE_* environment variables.");
    }
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (user && 'isGuest' in user) {
      saveGuestUser(null);
      setUser(null);
      return;
    }
    if (!hasFirebaseConfig || !auth) return;
    await firebaseSignOut(auth);
  };

  const guestSignIn = () => {
    const guest = createGuestUser();
    saveGuestUser(guest);
    setUser(guest);
  };

  const isGuest = user !== null && 'isGuest' in user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        firebaseReady: hasFirebaseConfig && auth !== null,
        signIn,
        signUp,
        signOut,
        guestSignIn,
        isGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
