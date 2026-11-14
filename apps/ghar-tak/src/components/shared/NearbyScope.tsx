import { Link } from 'wouter';
import { approximateListNote } from '@workspace/geo';
import { Button } from '@/components/ui/button';
import { useLocationChooser } from '@/components/shared/LocationChooser';
import { useLocation } from '@/hooks/useLocation';

/**
 * The line under a list's title that switches between "near me" and "all". With an
 * approximate location there is nothing to switch: everything is listed, nearest first,
 * and the customer is asked to pin their location. With none, they are asked to set one.
 */
export function NearbyScopeSwitch({
  path,
  showAll,
  approximate,
  known,
}: {
  path: string;
  showAll: boolean;
  approximate: boolean;
  /** Whether any location is known, however rough. */
  known: boolean;
}) {
  const { place, loading } = useLocation();
  const { openLocationChooser } = useLocationChooser();
  if (!known) {
    // While the browser is still answering there is nothing useful to say yet.
    if (loading) return null;
    return (
      <p className="text-sm text-amber-700 dark:text-amber-400">
        We don't know where you are, so everything is shown.{' '}
        <button type="button" onClick={openLocationChooser} className="text-primary hover:underline">
          Set your location
        </button>{' '}
        to see the ones that reach you.
      </p>
    );
  }
  if (approximate) {
    return (
      <p className="text-sm text-amber-700 dark:text-amber-400">
        {approximateListNote(place)}{' '}
        <button type="button" onClick={openLocationChooser} className="text-primary hover:underline">
          Pin your location
        </button>{' '}
        to see the ones that reach you.
      </p>
    );
  }
  return (
    <p className="text-sm text-muted-foreground">
      {showAll ? 'Showing all, near and far. ' : 'Showing only those that reach your location. '}
      <Link href={showAll ? path : `${path}?view=all`} className="text-primary hover:underline">
        {showAll ? 'Show only those near me' : 'Show all'}
      </Link>
      {' · '}
      <button type="button" onClick={openLocationChooser} className="text-primary hover:underline">
        Change location
      </button>
    </p>
  );
}

/** What a "near me" list shows when nothing reaches the customer. */
export function NoneNearby({ message, allHref, allLabel }: { message: string; allHref: string; allLabel: string }) {
  const { openLocationChooser } = useLocationChooser();
  return (
    <div className="text-center py-10 space-y-4">
      <p className="text-muted-foreground">{message}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button asChild variant="outline">
          <Link href={allHref}>{allLabel}</Link>
        </Button>
        <Button variant="ghost" onClick={openLocationChooser}>Change my location</Button>
      </div>
    </div>
  );
}
