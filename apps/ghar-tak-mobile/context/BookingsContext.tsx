import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface ServiceBooking {
  id: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  priceRange: string;
  date: string;
  timeSlot: string;
  address: string;
  notes: string;
  status: "pending" | "cancelled";
  createdAt: string;
}

export type NewBooking = Pick<
  ServiceBooking,
  "providerId" | "providerName" | "serviceName" | "priceRange" | "date" | "timeSlot" | "address" | "notes"
>;

interface BookingsContextValue {
  bookings: ServiceBooking[];
  bookService: (input: NewBooking) => Promise<ServiceBooking>;
  cancelBooking: (id: string) => Promise<void>;
}

const BOOKINGS_KEY = "ghar_tak_bookings";

const BookingsContext = createContext<BookingsContextValue>({
  bookings: [],
  bookService: async () => ({
    id: "",
    providerId: "",
    providerName: "",
    serviceName: "",
    priceRange: "",
    date: "",
    timeSlot: "",
    address: "",
    notes: "",
    status: "pending",
    createdAt: "",
  }),
  cancelBooking: async () => {},
});

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(BOOKINGS_KEY);
        if (raw) setBookings(JSON.parse(raw) as ServiceBooking[]);
      } catch {}
    })();
  }, []);

  const bookService = useCallback(async (input: NewBooking): Promise<ServiceBooking> => {
    const booking: ServiceBooking = {
      ...input,
      id: `booking_${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => {
      const next = [booking, ...prev];
      AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
    return booking;
  }, []);

  const cancelBooking = useCallback(async (id: string) => {
    setBookings((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b));
      AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo<BookingsContextValue>(
    () => ({ bookings, bookService, cancelBooking }),
    [bookings, bookService, cancelBooking],
  );

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings() {
  return useContext(BookingsContext);
}
