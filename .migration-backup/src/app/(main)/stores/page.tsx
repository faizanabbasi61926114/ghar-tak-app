import { mockStores } from '@/lib/mock-data';
import StoreCard from '@/components/shared/StoreCard';
import SearchInput from '@/components/shared/SearchInput';
import { ShoppingCart } from 'lucide-react';

export default function AllStoresPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <ShoppingCart className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold font-headline">All Stores</h1>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3">
         <SearchInput placeholder="Search stores..." />
        </div>
      </div>
      
      {mockStores.length === 0 ? (
        <p className="text-muted-foreground text-center py-10">No stores available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </div>
  );
}
