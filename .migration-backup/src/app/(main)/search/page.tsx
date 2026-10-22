"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mockProducts, mockStores, mockServiceProviders } from '@/lib/mock-data';
import type { Product, Store, ServiceProvider } from '@/lib/types';
import ProductCard from '@/components/shared/ProductCard';
import StoreCard from '@/components/shared/StoreCard';
import ServiceCard from '@/components/shared/ServiceCard';
import SearchInput from '@/components/shared/SearchInput';
import { SearchX } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceProvider[]>([]);

  useEffect(() => {
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      setFilteredProducts(
        mockProducts.filter(p => p.name.toLowerCase().includes(lowerCaseQuery) || p.description?.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredStores(
        mockStores.filter(s => s.name.toLowerCase().includes(lowerCaseQuery) || s.description?.toLowerCase().includes(lowerCaseQuery) || s.category.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredServices(
        mockServiceProviders.filter(sp => sp.name.toLowerCase().includes(lowerCaseQuery) || sp.description?.toLowerCase().includes(lowerCaseQuery) || sp.serviceCategory.toLowerCase().includes(lowerCaseQuery))
      );
    } else {
      setFilteredProducts([]);
      setFilteredStores([]);
      setFilteredServices([]);
    }
  }, [query]);

  const hasResults = filteredProducts.length > 0 || filteredStores.length > 0 || filteredServices.length > 0;

  return (
    <div className="space-y-8">
      <SearchInput initialQuery={query} placeholder="Search again..." />
      <h1 className="text-3xl font-bold font-headline">
        Search Results {query ? `for "${query}"` : ''}
      </h1>

      {!hasResults && query && (
        <div className="text-center py-12">
            <SearchX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Results Found</h2>
            <p className="text-muted-foreground">Try a different search term or explore our categories.</p>
        </div>
      )}

      {filteredStores.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold font-headline mb-4">Stores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map(store => <StoreCard key={store.id} store={store} />)}
          </div>
        </section>
      )}

      {filteredServices.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold font-headline mb-4">Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => <ServiceCard key={service.id} serviceProvider={service} />)}
          </div>
        </section>
      )}
      
      {filteredProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold font-headline mb-4">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

    </div>
  );
}
