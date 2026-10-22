'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ServiceProvider } from '@/lib/types';
import { mockServiceCategories } from '@/lib/mock-data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, CalendarClock, Heart, ShoppingBag } from 'lucide-react';

interface ServiceCardProps {
  serviceProvider: ServiceProvider;
  onToggleFavorite?: (serviceProviderId: string) => void;
  isFavorite?: boolean;
}

export default function ServiceCard({ serviceProvider, onToggleFavorite, isFavorite }: ServiceCardProps) {
  const serviceCategoryDetails = mockServiceCategories.find(cat => cat.id === serviceProvider.serviceCategory);

  const handleFavoriteClick = () => {
    if (onToggleFavorite) {
      onToggleFavorite(serviceProvider.id);
    }
  };
  
  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-lg flex flex-col">
      <CardHeader className="p-0">
        <Link href={`/services/${serviceProvider.serviceCategory}/${serviceProvider.id}`} className="block">
          <div className="aspect-[16/9] relative w-full">
            <Image
              src={serviceProvider.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(serviceProvider.name)}`}
              alt={serviceProvider.name}
              layout="fill"
              objectFit="cover"
              data-ai-hint={serviceProvider.dataAiHint || "service professional"}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/services/${serviceProvider.serviceCategory}/${serviceProvider.id}`}>
            <CardTitle className="text-lg font-headline hover:text-primary transition-colors line-clamp-1">{serviceProvider.name}</CardTitle>
          </Link>
          {onToggleFavorite && (
            <Button variant="ghost" size="icon" onClick={handleFavoriteClick} className="text-muted-foreground hover:text-destructive flex-shrink-0">
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
              <span className="sr-only">Favorite</span>
            </Button>
          )}
        </div>
        <CardDescription className="text-sm text-muted-foreground mb-1 line-clamp-2 h-10">
          {serviceProvider.description || `Professional ${serviceCategoryDetails?.name || 'services'}.`}
        </CardDescription>
        {serviceCategoryDetails && (
          <Badge variant="secondary" className="mb-2">{serviceCategoryDetails.name}</Badge>
        )}
        
        <div className="space-y-1 text-xs text-muted-foreground mt-2">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1.5 flex-shrink-0" />
            <span className="truncate">{serviceProvider.location.address || 'Service area varies'}</span>
          </div>
          <div className="flex items-center">
            <CalendarClock className="h-3 w-3 mr-1.5 flex-shrink-0" />
            <span>{serviceProvider.availability}</span>
          </div>
          {serviceProvider.rating && (
            <div className="flex items-center">
              <Star className="h-3 w-3 mr-1.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
              <span>{serviceProvider.rating.toFixed(1)} rating</span>
            </div>
          )}
          {serviceProvider.productsSold && serviceProvider.productsSold.length > 0 && (
            <div className="flex items-center text-primary">
              <ShoppingBag className="h-3 w-3 mr-1.5 flex-shrink-0" />
              <span>Also sells products</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t mt-auto">
        <Button asChild variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/services/${serviceProvider.serviceCategory}/${serviceProvider.id}`}>Book Service</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
