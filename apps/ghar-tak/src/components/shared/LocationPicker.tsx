import { useEffect, useRef, useState } from 'react';
import { Loader2, LocateFixed, MapPin } from 'lucide-react';
import {
  DEFAULT_MAP_CENTER,
  accuracyNote,
  cleanPoint,
  deviceReading,
  type Coords,
  type PointOrigin,
} from '@workspace/geo';
import { Button } from '@/components/ui/button';
import GoogleMapSurface from '@/components/shared/GoogleMapSurface';
import LazyMapChunk from '@/components/shared/LazyMapChunk';
import type { MapSurfaceHandle, MapSurfaceProps } from '@/components/shared/mapSurface';
import { googleMapsUnavailable, hasGoogleMapsKey } from '@/lib/googleMaps';

// The OpenStreetMap library is only downloaded when Google Maps can't be used.
const loadOsmSurface = () => import('@/components/shared/OsmMapSurface');

// The map box is h-72 (288 px); zoom levels are worked out for that height.
const MAP_HEIGHT_PX = 288;
// The browser's own timeout doesn't count the time its permission prompt stays open.
const LOCATE_WAIT_MS = 20000;

const samePoint = (a: Coords, b: Coords) => a.lat === b.lat && a.lng === b.lng;

/** The web-map zoom at which the map box shows about `km` of ground from top to bottom. */
function zoomForViewKm(km: number, lat: number): number {
  const metresPerPixelAtZoom0 = 156543.03 * Math.cos((lat * Math.PI) / 180);
  const zoom = Math.log2((metresPerPixelAtZoom0 * MAP_HEIGHT_PX) / (km * 1000));
  return Math.min(18, Math.max(3, Math.round(zoom)));
}

export interface LocationPickerProps {
  /** The chosen point, or null while nothing has been chosen. */
  value: Coords | null;
  /** The chosen point and how it was chosen. The origin stays the same through the zooms that follow. */
  onChange: (point: Coords, origin: PointOrigin) => void;
  /** Where to open the map when `value` is null, e.g. the customer's last known location. */
  openAt?: Coords | null;
  /** How much ground to show around `value` when the map opens (a vague location opens wider). */
  openViewKm?: number;
  /** Each new object moves the map there and chooses that spot (a city button, say). */
  jumpTo?: { point: Coords; zoom: number; city?: string } | null;
  /** The id of the element that names this map (a form label), for screen readers. */
  labelledBy?: string;
}

/**
 * A map with a fixed pin in the middle: the person drags the map until the pin sits on the
 * right spot. Nothing is chosen until they move the map, jump to a city or use their current
 * location (or `value` is set from outside), so an untouched map never saves the place it
 * happened to open at, and scrolling the page past the map changes nothing. Google Maps when
 * a working key is set, otherwise OpenStreetMap.
 */
export default function LocationPicker({
  value,
  onChange,
  openAt,
  openViewKm,
  jumpTo,
  labelledBy,
}: LocationPickerProps) {
  const [engine, setEngine] = useState<'google' | 'osm'>(() =>
    hasGoogleMapsKey && !googleMapsUnavailable() ? 'google' : 'osm',
  );
  const handleRef = useRef<MapSurfaceHandle | null>(null);
  const touchedRef = useRef(value !== null);
  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  // The last point this picker reported, to tell its own changes from ones made outside.
  const reportedRef = useRef<Coords | null>(value);
  // How the current point came to be. A placement by the device or a jump sticks, through
  // the zooms and map events that follow it, until the person moves the map themselves.
  const originRef = useRef<PointOrigin>({ kind: 'initial' });
  // A city jump asked for before the map was ready.
  const pendingJumpRef = useRef<{ point: Coords; zoom: number; city?: string } | null>(null);
  // Bumped by every choice, so a location reading that arrives late can't undo a later one.
  const choiceRef = useRef(0);
  const [locating, setLocating] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const report = (point: Coords) => {
    reportedRef.current = point;
    onChangeRef.current(point, originRef.current);
  };

  const supersedeLocating = () => {
    choiceRef.current += 1;
    setLocating(false);
  };

  const placeJump = (handle: MapSurfaceHandle, jump: { point: Coords; zoom: number; city?: string }) => {
    supersedeLocating();
    touchedRef.current = true;
    originRef.current = { kind: 'jump', ...(jump.city ? { city: jump.city } : {}) };
    setNote(null);
    handle.moveTo(jump.point, jump.zoom);
    report(cleanPoint(jump.point));
  };

  const start = value ?? openAt ?? DEFAULT_MAP_CENTER;
  const surfaceProps: MapSurfaceProps = {
    start: { point: start, zoom: value ? zoomForViewKm(openViewKm ?? 0.3, start.lat) : 13 },
    onUserMove: () => {
      supersedeLocating();
      touchedRef.current = true;
      originRef.current = { kind: 'moved' };
      setNote(null);
    },
    onMoveEnd: (center) => {
      if (!touchedRef.current) return;
      // A pin dragged while the map shows a whole city only marks an area (see PointOrigin).
      if (originRef.current.kind === 'moved') originRef.current = { kind: 'moved', viewKm: handleRef.current?.viewKm() };
      report(cleanPoint(center));
    },
    onReady: (handle) => {
      handleRef.current = handle;
      if (!handle) return;
      // The map opened on the current point, so that point counts as chosen.
      const current = valueRef.current;
      if (current) {
        touchedRef.current = true;
        reportedRef.current = current;
      }
      const jump = pendingJumpRef.current;
      pendingJumpRef.current = null;
      if (jump) placeJump(handle, jump);
    },
    onUnavailable: () => setEngine('osm'),
  };

  // A point set from outside (a form filling in a saved shop, say) moves the map to it.
  useEffect(() => {
    const handle = handleRef.current;
    const reported = reportedRef.current;
    if (!handle || !value || (reported && samePoint(reported, value))) return;
    reportedRef.current = value;
    touchedRef.current = true;
    originRef.current = { kind: 'initial' };
    handle.moveTo(value, Math.max(handle.zoom(), 17));
  }, [value]);

  useEffect(() => {
    if (!jumpTo) return;
    const handle = handleRef.current;
    if (!handle) {
      pendingJumpRef.current = jumpTo;
      return;
    }
    placeJump(handle, jumpTo);
  }, [jumpTo]);

  const locateMe = () => {
    if (!window.isSecureContext) {
      setNote('Browsers only share your location with secure (https) pages. Move the map to the right spot instead.');
      return;
    }
    if (!navigator.geolocation) {
      setNote("This browser can't share its location. Move the map to the right spot instead.");
      return;
    }
    choiceRef.current += 1;
    const ticket = choiceRef.current;
    const isCurrent = () => ticket === choiceRef.current;
    setLocating(true);
    setNote(null);
    // An ignored permission prompt, or an in-app browser that never answers, must not leave
    // the button spinning for ever.
    const giveUp = window.setTimeout(() => {
      if (!isCurrent()) return;
      supersedeLocating();
      setNote('Finding your location took too long. Move the map to the right spot instead.');
    }, LOCATE_WAIT_MS);
    const failed = (message: string) => {
      window.clearTimeout(giveUp);
      if (!isCurrent()) return;
      setLocating(false);
      setNote(message);
    };
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          window.clearTimeout(giveUp);
          if (!isCurrent()) return;
          setLocating(false);
          const reading = deviceReading(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
          if (!reading) {
            setNote("Couldn't get your location. Move the map to the right spot instead.");
            return;
          }
          const point = cleanPoint(reading.point);
          touchedRef.current = true;
          originRef.current = { kind: 'device', accuracyM: reading.accuracyM };
          handleRef.current?.moveTo(point, 18);
          report(point);
          setNote(accuracyNote(reading.accuracyM));
        },
        (error) =>
          failed(
            error.code === error.PERMISSION_DENIED
              ? 'Location permission is turned off. Move the map to the right spot instead.'
              : "Couldn't get your location. Move the map to the right spot instead.",
          ),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
      );
    } catch {
      // Some in-app browsers throw instead of calling the error callback.
      failed("Couldn't get your location. Move the map to the right spot instead.");
    }
  };

  return (
    <div className="space-y-2" role={labelledBy ? 'group' : undefined} aria-labelledby={labelledBy}>
      {/* The wrapper clips Leaflet's own focus outline, so it draws the ring for keyboard focus. */}
      <div className="relative isolate h-72 overflow-hidden rounded-md border has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
        {engine === 'google' ? (
          <GoogleMapSurface {...surfaceProps} />
        ) : (
          <LazyMapChunk load={loadOsmSurface} componentProps={surfaceProps} frameClassName="h-full w-full" />
        )}
        <MapPin
          className="pointer-events-none absolute left-1/2 top-1/2 z-[500] h-9 w-9 -translate-x-1/2 -translate-y-full fill-primary text-primary-foreground drop-shadow"
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <Button type="button" variant="outline" size="sm" onClick={locateMe} disabled={locating}>
          {locating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />}
          Use my current location
        </Button>
        {/* Not a live region: it changes on every map move, which would flood a screen reader. */}
        <span className="text-muted-foreground">
          {value ? (
            <>
              Pin at {value.lat.toFixed(5)}, {value.lng.toFixed(5)} ·{' '}
              <a
                href={`https://www.google.com/maps?q=${value.lat},${value.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                Check on Google Maps
              </a>
            </>
          ) : (
            'No pin yet: move the map to the right spot.'
          )}
        </span>
      </div>
      {/* Always in the page, so screen readers announce the note when it appears. */}
      <p role="status" className={note ? 'text-xs text-muted-foreground' : 'sr-only'}>
        {note}
      </p>
    </div>
  );
}
