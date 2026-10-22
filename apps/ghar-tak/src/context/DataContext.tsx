import { createContext, useContext, useEffect, useState } from 'react';
import type { Store, Product, ServiceCategory, ServiceProvider } from '@/lib/types';
import {
  fetchStores,
  fetchProducts,
  fetchServiceCategories,
  fetchServiceProviders,
} from '@/lib/db';
import {
  mockStores,
  mockProducts,
  mockServiceCategories,
  mockServiceProviders,
} from '@/lib/mock-data';

interface DataContextType {
  stores: Store[];
  products: Product[];
  serviceCategories: ServiceCategory[];
  serviceProviders: ServiceProvider[];
  loading: boolean;
}

const DataContext = createContext<DataContextType>({
  stores: mockStores,
  products: mockProducts,
  serviceCategories: mockServiceCategories,
  serviceProviders: mockServiceProviders,
  loading: false,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(mockServiceCategories);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>(mockServiceProviders);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchStores(),
      fetchProducts(),
      fetchServiceCategories(),
      fetchServiceProviders(),
    ])
      .then(([s, p, sc, sp]) => {
        setStores(s);
        setProducts(p);
        setServiceCategories(sc);
        setServiceProviders(sp);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DataContext.Provider value={{ stores, products, serviceCategories, serviceProviders, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
