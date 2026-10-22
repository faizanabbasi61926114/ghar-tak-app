'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Store } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Star, Clock } from 'lucide-react';

interface StoreCardProps {
  store: Store;
  onToggleFavorite?: (storeId: string) => void;
}

export default function StoreCard({ store, onToggleFavorite }: StoreCardProps) {
  const handleFavoriteClick = () => {
    if (onToggleFavorite) {
      onToggleFavorite(store.id);
    }
  };

  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={`/stores/${store.id}`} className="block">
          <div className="aspect-[16/9] relative w-full">
            <Image
              src={store.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(store.name)}`}
              alt={store.name}
              layout="fill"
              objectFit="cover"
              data-ai-hint={store.dataAiHint || "store exterior"}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/stores/${store.id}`}>
            <CardTitle className="text-lg font-headline hover:text-primary transition-colors">{store.name}</CardTitle>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleFavoriteClick} className="text-muted-foreground hover:text-destructive">
            <Heart className={`h-5 w-5 ${store.isFavorite ? 'fill-destructive text-destructive' : ''}`} />
            <span className="sr-only">Favorite</span>
          </Button>
        </div>
        <CardDescription className="text-sm text-muted-foreground mb-1 line-clamp-2">
          {store.description || `Explore a wide range of products at ${store.name}.`}
        </CardDescription>
         <Badge variant="secondary" className="mb-2">{store.category}</Badge>
        
        <div className="flex items-center text-xs text-muted-foreground mb-1">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span>{store.location.address || 'Unknown location'}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {store.rating && (
            <div className="flex items-center">
              <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
              <span>{store.rating.toFixed(1)}</span>
            </div>
          )}
          {store.deliveryTime && (
             <div className="flex items-center">
               <Clock className="h-3 w-3 mr-1" />
               <span>{store.deliveryTime}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/stores/${store.id}`}>View Store</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
