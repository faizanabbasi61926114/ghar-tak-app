import { useListProviders } from '@workspace/api-client-react';
import StoreCard from '@/components/shared/StoreCard';
import ServiceCard from '@/components/shared/ServiceCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, Loader2 } from 'lucide-react';
import type { Provider } from '@workspace/api-client-react';

const SORTED_ITEMS_COUNT = 3;

export default function NearbyProvidersSection() {
  const { data: stores, isLoading: storesLoading } = useListProviders({ type: 'store' }, { query: { queryKey: ["listProviders", { type: 'store' }] } });
  const { data: services, isLoading: servicesLoading } = useListProviders({ type: 'service' }, { query: { queryKey: ["listProviders", { type: 'service' }] } });

  const sortedStores = Array.isArray(stores) ? stores.slice(0, SORTED_ITEMS_COUNT) : [];
  const sortedServiceProviders = Array.isArray(services) ? services.slice(0, SORTED_ITEMS_COUNT) : [];

  const renderContent = (
    isLoading: boolean,
    items: Provider[],
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
            ? <StoreCard key={item.id} store={item} />
            : <ServiceCard key={item.id} serviceProvider={item} />
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
          {renderContent(storesLoading, sortedStores, 'store')}
          {(stores?.length || 0) > SORTED_ITEMS_COUNT && (
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
          {renderContent(servicesLoading, sortedServiceProviders, 'service')}
          {(services?.length || 0) > SORTED_ITEMS_COUNT && (
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
