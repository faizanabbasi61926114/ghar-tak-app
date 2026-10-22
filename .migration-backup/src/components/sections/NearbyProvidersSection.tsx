
'use client';

import { useMemo } from 'react';
import { mockStores, mockServiceProviders } from '@/lib/mock-data';
import StoreCard from '@/components/shared/StoreCard';
import ServiceCard from '@/components/shared/ServiceCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';
import { getDistance } from '@/lib/utils';
import type { Store, ServiceProvider } from '@/lib/types';

const SORTED_ITEMS_COUNT = 3;

export default function NearbyProvidersSection() {
  const { location, loading: locationLoading } = useLocation();

  const sortedStores = useMemo(() => {
    if (!location) return [];
    return [...mockStores]
      .map(store => ({
        ...store,
        distance: getDistance(location.lat, location.lng, store.location.lat, store.location.lng)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, SORTED_ITEMS_COUNT) as (Store & { distance: number })[];
  }, [location]);

  const sortedServiceProviders = useMemo(() => {
    if (!location) return [];
    return [...mockServiceProviders]
      .map(provider => ({
        ...provider,
        distance: getDistance(location.lat, location.lng, provider.location.lat, provider.location.lng)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, SORTED_ITEMS_COUNT) as (ServiceProvider & { distance: number })[];
  }, [location]);

  const renderContent = (
    isLoading: boolean, 
    items: (Store & { distance: number })[] | (ServiceProvider & { distance: number })[],
    type: 'store' | 'service'
  ) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Finding closest providers...</p>
        </div>
      );
    }
    if (items.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Could not find any {type === 'store' ? 'stores' : 'services'} nearby.</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          type === 'store'
            ? <StoreCard key={item.id} store={item as Store} />
            : <ServiceCard key={item.id} serviceProvider={item as ServiceProvider} />
        ))}
      </div>
    );
  };

  return (
    <section className="py-8 md:py-12">
      <Tabs defaultValue="stores" className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-headline font-bold text-center md:text-left mb-4 md:mb-0">Discover Nearby</h2>
          <TabsList>
            <TabsTrigger value="stores">Stores</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="stores">
          {renderContent(locationLoading, sortedStores, 'store')}
          {mockStores.length > SORTED_ITEMS_COUNT && (
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/stores">
                  View All Stores <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="services">
          {renderContent(locationLoading, sortedServiceProviders, 'service')}
           {mockServiceProviders.length > SORTED_ITEMS_COUNT && (
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/services">
                  View All Services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
