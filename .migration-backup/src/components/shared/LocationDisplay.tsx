
'use client';

import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocation } from '@/hooks/useLocation';

export default function LocationDisplay() {
  const { location, error, loading, refetchLocation } = useLocation();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground p-2 rounded-lg bg-muted/50">
        <MapPin className="h-5 w-5 text-primary" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground p-3 rounded-lg shadow-sm border bg-card">
      <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
      {error && (
         <div className="flex items-center space-x-2">
           <span className="text-destructive-foreground bg-destructive/80 px-2 py-1 rounded-md text-xs">{error}</span>
         </div>
      )}
      {location && (
        <div className="flex items-center space-x-2">
          <span>Location: {location.address}</span>
           <Button variant="ghost" size="sm" onClick={refetchLocation} className="text-primary hover:text-primary/80">Refresh</Button>
        </div>
      )}
    </div>
  );
}
