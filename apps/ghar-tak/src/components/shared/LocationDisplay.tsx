import { Loader2, MapPin } from 'lucide-react';
import { locationSummary } from '@workspace/geo';
import { Button } from '@/components/ui/button';
import { useLocationChooser } from '@/components/shared/LocationChooser';
import { useLocation } from '@/hooks/useLocation';

/** The home page line that says which location the lists are for, with a way to change it. */
export default function LocationDisplay() {
  const { saved, loading } = useLocation();
  const { openLocationChooser } = useLocationChooser();
  const { message, action, warn } = locationSummary({ saved, loading });

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg shadow-sm border bg-card">
      {loading && !saved ? (
        <Loader2 className="h-5 w-5 text-primary flex-shrink-0 animate-spin" aria-hidden="true" />
      ) : (
        <MapPin className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
      )}
      <span aria-live="polite" className={warn ? 'text-amber-700 dark:text-amber-400' : undefined}>
        {message}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={openLocationChooser}
        className="text-primary hover:text-primary/80"
        aria-label={action === 'Change' ? 'Change location' : undefined}
      >
        {action}
      </Button>
    </div>
  );
}
