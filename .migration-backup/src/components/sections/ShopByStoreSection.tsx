
'use client';

import { useState, useMemo } from 'react';
import { mockStores, mockProducts } from '@/lib/mock-data';
import type { Product, Store } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/shared/ProductCard';
import { ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLocation } from '@/hooks/useLocation';
import { getDistance } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function ShopByStoreSection() {
  const { location, loading: locationLoading } = useLocation();

  const nearbyStores = useMemo(() => {
    if (!location) return [];
    return [...mockStores]
      .map(store => ({
        ...store,
        distance: getDistance(location.lat, location.lng, store.location.lat, store.location.lng)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3) as (Store & { distance: number })[];
  }, [location]);

  const [selectedStoreId, setSelectedStoreId] = useState(nearbyStores[0]?.id || '');

  // Update selected store when nearby stores are loaded
  useMemo(() => {
    if (nearbyStores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(nearbyStores[0].id);
    }
  }, [nearbyStores, selectedStoreId]);

  if (locationLoading) {
    return (
      <section className="py-8 md:py-12">
        <div className="flex items-center mb-8">
          <ShoppingBag className="h-8 w-8 text-primary mr-3" />
          <h2 className="text-3xl font-headline font-bold">Shop from Nearby Stores</h2>
        </div>
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (nearbyStores.length === 0) {
    return null; // Don't render anything if there are no nearby stores
  }

  const getProductsForStore = (storeId: string): Product[] => {
    return mockProducts.filter(product => product.storeId === storeId);
  };

  return (
    <section className="py-8 md:py-12">
      <div className="flex items-center mb-8">
        <ShoppingBag className="h-8 w-8 text-primary mr-3" />
        <h2 className="text-3xl font-headline font-bold">Shop from Nearby Stores</h2>
      </div>

      <Tabs defaultValue={nearbyStores[0].id} onValueChange={setSelectedStoreId} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6 h-auto">
          {nearbyStores.map((store) => (
            <TabsTrigger key={store.id} value={store.id} className="py-3 text-md">
              {store.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {nearbyStores.map((store) => {
          const products = getProductsForStore(store.id);
          return (
            <TabsContent key={store.id} value={store.id}>
              {products.length > 0 ? (
                 <ScrollArea className="w-full whitespace-nowrap rounded-md">
                    <div className="flex w-max space-x-4 p-4">
                        {products.map((product) => (
                          <div key={product.id} className="w-64">
                            <ProductCard product={product} />
                          </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
              ) : (
                <div className="text-center py-10 px-6 border rounded-lg bg-card shadow-sm">
                    <p className="text-lg text-muted-foreground">No products found for {store.name}.</p>
                    <p className="text-md text-muted-foreground mt-2">Check out the <Link href={`/stores/${store.id}`} className="text-primary hover:underline">store page</Link> for more details.</p>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
}
