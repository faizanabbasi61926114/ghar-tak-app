import { describe, expect, it } from "vitest";
import {
  CITIES,
  CITY_ACCURACY_M,
  DEFAULT_MAP_CENTER,
  MAX_DEVICE_LOCATION_AGE_MS,
  PRECISE_VIEW_KM,
  ROUGH_ACCURACY_M,
  accuracyNote,
  approximateListNote,
  cleanPoint,
  deviceReading,
  distanceText,
  isApproximate,
  isOutdated,
  locationSummary,
  locationToSave,
  makeSavedLocation,
  parseSavedLocation,
  reachVerdict,
  serializeSavedLocation,
  viewKmFor,
  type SavedLocation,
} from "./index";

const NOW = 1_800_000_000_000;
const LAHORE = { lat: 31.5204, lng: 74.3587 };
const json = (value: unknown) => JSON.stringify(value);

describe("reading a saved location", () => {
  it("round-trips what it writes", () => {
    const saved = makeSavedLocation(LAHORE, { source: "chosen", accuracyM: CITY_ACCURACY_M, place: "Lahore" }, NOW);
    expect(parseSavedLocation(serializeSavedLocation(saved))).toEqual(saved);
    const device = makeSavedLocation(LAHORE, { source: "device", accuracyM: 30 }, NOW);
    expect(parseSavedLocation(serializeSavedLocation(device))).toEqual(device);
  });

  it("treats anything unusable as nothing saved", () => {
    for (const raw of [
      null,
      "",
      "not json",
      "null",
      "[]",
      '"text"',
      json({ lat: 95, lng: 74, source: "chosen" }),
      json({ lat: 31, lng: 181, source: "chosen" }),
      json({ lat: "31.5", lng: 74, source: "chosen" }),
      json({ lat: 31, lng: 74 }), // saved before pinning existed: no source
      json({ lat: 31, lng: 74, source: "gps" }),
      json({ lat: 0, lng: 0, source: "device", accuracyM: 10 }), // a broken reading
      json({ lat: Number.NaN, lng: 74, source: "chosen" }),
    ]) {
      expect(parseSavedLocation(raw)).toBeNull();
    }
  });

  it("keeps a city approximate even if its accuracy was lost, and trims an oversized place", () => {
    const city = parseSavedLocation(json({ ...LAHORE, source: "chosen", place: "Lahore", savedAt: 1 }));
    expect(city?.accuracyM).toBe(CITY_ACCURACY_M);
    expect(isApproximate(city!.accuracyM)).toBe(true);
    expect(parseSavedLocation(json({ ...LAHORE, source: "chosen", place: "x".repeat(5000) }))?.place).toHaveLength(60);
  });

  it("drops a negative or non-number accuracy and a missing time", () => {
    const saved = parseSavedLocation(json({ ...LAHORE, source: "device", accuracyM: -5 }));
    expect(saved?.accuracyM).toBeNull();
    expect(saved?.savedAt).toBe(0);
    expect(parseSavedLocation(json({ ...LAHORE, source: "device", accuracyM: "30" }))?.accuracyM).toBeNull();
  });
});

describe("when a device reading is outdated", () => {
  const device = (savedAt: number): SavedLocation => makeSavedLocation(LAHORE, { source: "device", accuracyM: 30 }, savedAt);

  it("ages a device reading after a day", () => {
    expect(isOutdated(device(NOW - MAX_DEVICE_LOCATION_AGE_MS + 1000), NOW)).toBe(false);
    expect(isOutdated(device(NOW - MAX_DEVICE_LOCATION_AGE_MS - 1000), NOW)).toBe(true);
    expect(isOutdated(device(0), NOW)).toBe(true);
  });

  it("treats a time from a clock that ran ahead as outdated, so it can't freeze for ever", () => {
    expect(isOutdated(device(NOW + 60 * 1000), NOW)).toBe(false); // small drift is fine
    expect(isOutdated(device(NOW + 365 * MAX_DEVICE_LOCATION_AGE_MS), NOW)).toBe(true);
  });

  it("never ages a chosen spot", () => {
    expect(isOutdated(makeSavedLocation(LAHORE, { source: "chosen" }, 0), NOW)).toBe(false);
  });
});

describe("checking a device reading", () => {
  it("rounds the accuracy and keeps a missing one as unknown", () => {
    expect(deviceReading(31.5, 74.3, 12.6)).toEqual({ point: { lat: 31.5, lng: 74.3 }, accuracyM: 13 });
    expect(deviceReading(31.5, 74.3, undefined)?.accuracyM).toBeNull();
    expect(deviceReading(31.5, 74.3, Number.NaN)?.accuracyM).toBeNull();
  });

  it("refuses readings that can't be right", () => {
    expect(deviceReading(0, 0, 10)).toBeNull();
    expect(deviceReading(91, 74, 10)).toBeNull();
    expect(deviceReading(31.5, 74.3, -1)).toBeNull(); // iOS: invalid fix
  });

  it("makes an approximate-only permission count as approximate, whatever accuracy it claims", () => {
    expect(isApproximate(deviceReading(31.5, 74.3, 2000, { coarse: true })!.accuracyM)).toBe(true);
    expect(isApproximate(deviceReading(31.5, 74.3, null, { coarse: true })!.accuracyM)).toBe(true);
    expect(deviceReading(31.5, 74.3, 5000, { coarse: true })!.accuracyM).toBe(5000);
  });
});

describe("what the map dialog saves", () => {
  it("saves nothing when nobody moved the map", () => {
    expect(locationToSave({ kind: "initial" }, LAHORE)).toBeNull();
  });

  it("keeps a device reading a device reading, with its accuracy", () => {
    expect(locationToSave({ kind: "device", accuracyM: 3500 }, LAHORE)).toEqual({
      point: LAHORE,
      how: { source: "device", accuracyM: 3500 },
    });
  });

  it("saves a city as an approximate city", () => {
    const saved = locationToSave({ kind: "jump", city: "Karachi" }, LAHORE)!;
    expect(saved.how).toEqual({ source: "chosen", accuracyM: CITY_ACCURACY_M, place: "Karachi" });
  });

  it("saves a dragged pin as precise only when the map showed a street-sized area", () => {
    expect(locationToSave({ kind: "moved" }, LAHORE)!.how).toEqual({ source: "chosen" });
    expect(locationToSave({ kind: "moved", viewKm: 1.2 }, LAHORE)!.how).toEqual({ source: "chosen" });
    const wide = locationToSave({ kind: "moved", viewKm: 16 }, LAHORE)!.how;
    expect(wide).toEqual({ source: "chosen", accuracyM: 8000 });
    expect(isApproximate(wide.accuracyM ?? null)).toBe(true);
    expect(isApproximate(locationToSave({ kind: "moved", viewKm: PRECISE_VIEW_KM + 0.1 }, LAHORE)!.how.accuracyM ?? null)).toBe(true);
  });
});

describe("map helpers", () => {
  it("cleans a point the way the database keeps it", () => {
    expect(cleanPoint({ lat: 31.123456789, lng: 474.3587 })).toEqual({ lat: 31.1234568, lng: 114.3587 });
    expect(cleanPoint({ lat: 0, lng: 180 }).lng).toBe(-180);
  });

  it("opens the map wider for a vaguer location", () => {
    expect(viewKmFor(null)).toBe(0.6);
    expect(viewKmFor(30)).toBe(0.6);
    expect(viewKmFor(CITY_ACCURACY_M)).toBe(25);
    expect(viewKmFor(100_000)).toBe(40);
  });

  it("opens at Lahore when nothing is known", () => {
    expect(DEFAULT_MAP_CENTER).toEqual({ lat: CITIES[0].lat, lng: CITIES[0].lng });
  });

  it("keeps a picked city vaguer than the approximate line", () => {
    expect(CITY_ACCURACY_M).toBeGreaterThan(ROUGH_ACCURACY_M);
  });
});

describe("words customers read", () => {
  it("says 'About' only for an approximate location", () => {
    expect(distanceText(2.34, false)).toBe("2.3 km away");
    expect(distanceText(2.34, true)).toBe("About 2.3 km away");
  });

  it("describes the reach, with 'just outside' at the rounded edge", () => {
    expect(reachVerdict({ distanceKm: 2, radiusKm: 5, reaches: true }, false)).toBe("delivers to your location");
    expect(reachVerdict({ distanceKm: 2, radiusKm: 5, reaches: true }, true)).toBe("serves your location");
    expect(reachVerdict({ distanceKm: 5.04, radiusKm: 5, reaches: false }, false)).toBe("just outside its 5 km delivery area");
    expect(reachVerdict({ distanceKm: 7, radiusKm: 5, reaches: false }, true)).toBe("outside its 5 km service area");
  });

  it("gives the banner for every state", () => {
    const at = (how: Parameters<typeof makeSavedLocation>[1], savedAt = NOW) => makeSavedLocation(LAHORE, how, savedAt);
    expect(locationSummary({ saved: null, loading: true, now: NOW })).toMatchObject({ message: "Finding your location…", warn: false });
    expect(locationSummary({ saved: null, loading: false, now: NOW })).toMatchObject({ action: "Set your location", warn: true });
    expect(locationSummary({ saved: at({ source: "device", accuracyM: 2001 }), loading: false, now: NOW }).message).toContain(
      "within about 3 km",
    );
    expect(
      locationSummary({ saved: at({ source: "chosen", accuracyM: CITY_ACCURACY_M, place: "Multan" }), loading: false, now: NOW }).message,
    ).toContain("nearest to Multan first");
    expect(locationSummary({ saved: at({ source: "chosen" }), loading: false, now: NOW }).message).toContain("the spot you pinned");
    expect(locationSummary({ saved: at({ source: "device", accuracyM: 20 }), loading: false, now: NOW }).message).toContain(
      "your current location",
    );
    expect(
      locationSummary({ saved: at({ source: "device", accuracyM: 20 }, NOW - 3 * MAX_DEVICE_LOCATION_AGE_MS), loading: false, now: NOW })
        .message,
    ).toContain("your last known location");
  });

  it("explains an approximate list", () => {
    expect(approximateListNote("Lahore")).toBe("You picked Lahore, so everything is shown, nearest first.");
    expect(approximateListNote(null)).toContain("only approximate");
  });

  it("describes a device reading's accuracy", () => {
    expect(accuracyNote(3500)).toContain("within about 3.5 km");
    expect(accuracyNote(40)).toBe("Placed to within about 40 m. Check that the pin is on the right spot.");
    expect(accuracyNote(0)).toContain("Placed at your current location");
    expect(accuracyNote(null, { hasMap: false })).toBe("Found your current location.");
  });
});
