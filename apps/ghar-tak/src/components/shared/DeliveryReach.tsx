import { Navigation } from 'lucide-react';
import type { Provider } from '@workspace/api-client-react';
import { approximateReason, checkWhat, deliveryReach, distanceText, reachVerdict } from '@workspace/geo';
import { useLocationChooser } from '@/components/shared/LocationChooser';
import { useLocation } from '@/hooks/useLocation';
import { useNearbyFilter } from '@/hooks/useNearby';

/**
 * "2.3 km away · delivers to your location", or that the customer is outside its area.
 * With an approximate location it says so instead of guessing either way.
 */
export default function DeliveryReach({ provider, className = '' }: { provider: Provider; className?: string }) {
  const { point, approximate } = useNearbyFilter();
  const { place } = useLocation();
  const { openLocationChooser } = useLocationChooser();
  const reach = deliveryReach(point, provider);
  if (!reach) return null;

  const isService = provider.type === 'service';

  if (approximate) {
    return (
      <div className={`flex items-center text-muted-foreground ${className}`}>
        <Navigation className="h-4 w-4 mr-2 flex-shrink-0" />
        <span>
          {distanceText(reach.distanceKm, true)} · {approximateReason(place)}.{' '}
          <button type="button" onClick={openLocationChooser} className="text-primary hover:underline">
            Pin your location
          </button>{' '}
          to check {checkWhat(isService)}.
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center ${reach.reaches ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'} ${className}`}
    >
      <Navigation className="h-4 w-4 mr-2 flex-shrink-0" />
      <span>
        {distanceText(reach.distanceKm, false)} · {reachVerdict(reach, isService)}
      </span>
    </div>
  );
}
