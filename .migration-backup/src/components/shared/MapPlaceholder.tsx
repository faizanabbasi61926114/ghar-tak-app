import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Map } from 'lucide-react';

interface MapPlaceholderProps {
  height?: number;
}

export default function MapPlaceholder({ height = 400 }: MapPlaceholderProps) {
  return (
    <section className="py-8">
       <h2 className="text-3xl font-headline font-bold mb-6 text-center md:text-left">Explore on Map</h2>
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-0">
          <div style={{ height: `${height}px` }} className="relative bg-muted flex items-center justify-center">
            <Image
              src={`https://placehold.co/1200x${height}.png`}
              alt="Map placeholder showing nearby providers"
              layout="fill"
              objectFit="cover"
              data-ai-hint="city map"
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center p-4 z-10">
               <Map className="h-16 w-16 text-white/80 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2 font-headline">Interactive Map Coming Soon!</h3>
              <p className="text-white/90 max-w-md">Visualize nearby stores and service providers directly on the map. This feature will allow for easy navigation and discovery.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
