
"use client";

import { mockStores, mockServiceProviders } from '@/lib/mock-data';
import StoreCard from '@/components/shared/StoreCard';
import ServiceCard from '@/components/shared/ServiceCard';
import { Heart, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  const { user, loading } = useAuth();

  // Filter for favorited items (mocked)
  // In a real app, these would be fetched based on the logged-in user's preferences
  const favoriteStores = mockStores.filter(store => store.isFavorite);
  // Assuming we add an isFavorite to ServiceProvider or manage it elsewhere
  const favoriteServices = mockServiceProviders.filter((_, index) => index % 2 === 0); // Mocking some favorites

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
        <LogIn className="h-16 w-16 text-primary mb-6" />
        <h1 className="text-2xl font-bold font-headline mb-3">Access Your Favorites</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          Please sign in to view and manage your favorite stores and services.
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center mb-8">
          <Heart className="h-8 w-8 text-destructive mr-3" />
          <h1 className="text-3xl font-bold font-headline">Your Favorites</h1>
        </div>

        {favoriteStores.length === 0 && favoriteServices.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Favorites Yet</h2>
            <p className="text-muted-foreground">Start exploring and mark items you love with the heart icon!</p>
          </div>
        )}

        {favoriteStores.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold font-headline mb-6">Favorite Stores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteStores.map(store => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </div>
        )}

        {favoriteServices.length > 0 && (
           <div>
            <h2 className="text-2xl font-semibold font-headline mb-6">Favorite Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteServices.map(service => (
                <ServiceCard key={service.id} serviceProvider={service} isFavorite={true} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
