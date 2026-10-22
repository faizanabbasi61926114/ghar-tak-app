import { mockStores, mockProducts } from '@/lib/mock-data';
import type { Store, Product } from '@/lib/types';
import ProductCard from '@/components/shared/ProductCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { MapPin, Star, Clock, ArrowLeft, Heart, Wrench, List } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function StoreDetailPage({ params }: { params: { id: string } }) {
  const store: Store | undefined = mockStores.find(s => s.id === params.id);
  const storeProducts: Product[] = mockProducts.filter(p => p.storeId === params.id);

  if (!store) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Store not found</h1>
        <Link href="/stores" className="text-primary hover:underline mt-4 inline-block">
          Back to all stores
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link href="/stores" className="flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to All Stores
      </Link>

      <Card className="overflow-hidden shadow-xl">
        <CardHeader className="p-0 relative">
          <div className="aspect-[16/5] w-full relative">
            <Image
              src={store.imageUrl || `https://placehold.co/1200x400.png?text=${encodeURIComponent(store.name)}`}
              alt={`${store.name} banner`}
              layout="fill"
              objectFit="cover"
              data-ai-hint={store.dataAiHint || "store banner"}
            />
          </div>
           <div className="absolute top-4 right-4">
            <Button variant="secondary" size="icon" className="bg-background/70 hover:bg-background text-muted-foreground hover:text-destructive">
              <Heart className={`h-5 w-5 ${store.isFavorite ? 'fill-destructive text-destructive' : ''}`} />
              <span className="sr-only">Favorite</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between">
            <div className="flex-grow">
              <CardTitle className="text-3xl font-bold font-headline mb-1">{store.name}</CardTitle>
              <Badge variant="outline" className="mb-2">{store.category}</Badge>
              <CardDescription className="text-muted-foreground mb-3 max-w-2xl">{store.description}</CardDescription>
            </div>
            <div className="text-sm text-muted-foreground space-y-1 md:text-right mt-4 md:mt-0 flex-shrink-0 md:pl-6">
              <div className="flex items-center md:justify-end">
                <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                <span>{store.location.address || 'Location not specified'}</span>
              </div>
              <div className="flex items-center md:justify-end space-x-4">
                {store.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                    <span>{store.rating.toFixed(1)} rating</span>
                  </div>
                )}
                 {store.deliveryTime && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{store.deliveryTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {store.servicesOffered && store.servicesOffered.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold font-headline mb-4 flex items-center">
            <Wrench className="h-6 w-6 mr-3 text-primary" />
            Services Offered by {store.name}
          </h2>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <ul className="space-y-2">
                {store.servicesOffered.map((service, index) => (
                  <li key={index} className="flex items-center">
                    <List className="h-4 w-4 mr-2 text-muted-foreground" /> 
                    {service}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}
      <Separator />
      <section>
        <h2 className="text-2xl font-semibold font-headline mb-6">Products from {store.name}</h2>
        {storeProducts.length === 0 ? (
          <p className="text-muted-foreground">No products listed for this store yet.</p>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex w-max space-x-4 p-4">
              {storeProducts.map(product => (
                <div key={product.id} className="w-64">
                   <ProductCard product={product} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </section>
    </div>
  );
}
