import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import {
  fetchProducts,
  fetchServiceCategories,
  fetchServiceProviders,
  fetchStores,
} from "@/lib/db";
import {
  mockProducts,
  mockServiceCategories,
  mockServiceProviders,
  mockStores,
  type Product,
  type ServiceCategory,
  type ServiceProvider,
  type Store,
} from "@/lib/data";

interface Catalog {
  stores: Store[];
  products: Product[];
  serviceCategories: ServiceCategory[];
  serviceProviders: ServiceProvider[];
}

interface DataContextType extends Catalog {
  loading: boolean;
  refreshing: boolean;
  refresh: () => Promise<void>;
}

const INITIAL_CATALOG: Catalog = {
  stores: mockStores,
  products: mockProducts,
  serviceCategories: mockServiceCategories,
  serviceProviders: mockServiceProviders,
};

const CACHE_KEY = "ghar_tak_catalog_cache_v1";

const DataContext = createContext<DataContextType>({
  ...INITIAL_CATALOG,
  loading: false,
  refreshing: false,
  refresh: async () => {},
});

function isCatalog(value: unknown): value is Catalog {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Catalog>;
  return (
    Array.isArray(candidate.stores) &&
    Array.isArray(candidate.products) &&
    Array.isArray(candidate.serviceCategories) &&
    Array.isArray(candidate.serviceProviders)
  );
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog>(INITIAL_CATALOG);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const inFlight = useRef<Promise<void> | null>(null);

  const load = useCallback(async () => {
    if (inFlight.current) return inFlight.current;

    const run = (async () => {
      try {
        const [stores, products, serviceCategories, serviceProviders] = await Promise.all([
          fetchStores(),
          fetchProducts(),
          fetchServiceCategories(),
          fetchServiceProviders(),
        ]);
        const next: Catalog = { stores, products, serviceCategories, serviceProviders };
        setCatalog(next);
        try {
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(next));
        } catch {
          // Cache writes are best-effort.
        }
      } catch {
        // Keep the cached catalog (or bundled defaults) when the network fails.
      }
    })();

    inFlight.current = run;
    try {
      await run;
    } finally {
      inFlight.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(CACHE_KEY);
        if (raw && !cancelled) {
          const cached: unknown = JSON.parse(raw);
          if (isCatalog(cached)) setCatalog(cached);
        }
      } catch {
        // Fall back to the bundled defaults.
      }
      if (cancelled) return;
      await load();
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [load]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const value = useMemo<DataContextType>(
    () => ({ ...catalog, loading, refreshing, refresh }),
    [catalog, loading, refreshing, refresh],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
