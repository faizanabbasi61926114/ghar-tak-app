import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EARTH_RADIUS_KM, MAX_DELIVERY_RADIUS_KM, distanceKm, type Coords } from "@workspace/geo";
import { SIGNED_IN_AS, api, createProvider, resetDatabase } from "../test/helpers";

const SELLER = "seller-1";
const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (radians: number) => (radians * 180) / Math.PI;

/** The point `km` from `from` on the given compass bearing. */
function travel(from: Coords, km: number, bearingDeg: number): Coords {
  const d = km / EARTH_RADIUS_KM;
  const lat1 = rad(from.lat);
  const bearing = rad(bearingDeg);
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(bearing));
  const lng2 =
    rad(from.lng) +
    Math.atan2(Math.sin(bearing) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
  const lng = ((deg(lng2) + 540) % 360) - 180;
  return { lat: deg(lat2), lng };
}

const pin = (point: Coords) => ({ lat: point.lat.toFixed(7), lng: point.lng.toFixed(7) });
const names = (body: { name: string }[]) => body.map((p) => p.name).sort();

describe("near me at the edges of the search box", () => {
  beforeEach(resetDatabase);

  it("finds a shop with the largest radius just inside it in every direction", async () => {
    for (const customer of [
      { lat: 31.5204, lng: 74.3587 },
      { lat: 60, lng: 10 }, // further from the equator, a degree of longitude is shorter
      { lat: -45, lng: 170 },
    ]) {
      await resetDatabase();
      const shops: string[] = [];
      for (const bearing of [0, 45, 90, 135, 180, 225, 270, 315]) {
        const name = `${bearing}°`;
        const point = travel(customer, MAX_DELIVERY_RADIUS_KM - 0.05, bearing);
        expect(distanceKm(customer, point)).toBeLessThan(MAX_DELIVERY_RADIUS_KM);
        await createProvider(name, { name, ...pin(point), deliveryRadiusKm: String(MAX_DELIVERY_RADIUS_KM) });
        shops.push(name);
      }
      const res = await api().get("/api/providers").query(customer);
      expect(res.status).toBe(200);
      expect(names(res.body)).toEqual(shops.sort());
    }
  });

  it("works across the date line and near a pole", async () => {
    await createProvider("East of the date line", { name: "East of the date line", lat: "10.0000000", lng: "-179.9500000", deliveryRadiusKm: "20" });
    const acrossDateLine = await api().get("/api/providers").query({ lat: 10, lng: 179.95 });
    expect(names(acrossDateLine.body)).toEqual(["East of the date line"]);

    await createProvider("Over the pole", { name: "Over the pole", lat: "89.9000000", lng: "100.0000000", deliveryRadiusKm: "50" });
    const nearPole = await api().get("/api/providers").query({ lat: 89.9, lng: -80 });
    expect(names(nearPole.body)).toEqual(["Over the pole"]);
  });
});

describe("list and search filters", () => {
  beforeEach(resetDatabase);

  it("refuses filters the database can't take, with a 400 that names the field", async () => {
    await createProvider("a", { name: "Corner Store", type: "store" });
    for (const query of ["q=%00", "category=%00", "type=%00", "type=other", "type=store&type=service", "q=a&q=b"]) {
      const res = await api().get(`/api/providers?${query}`);
      expect(res.status, query).toBe(400);
      expect(res.body.fields?.length, query).toBeGreaterThan(0);
    }
    const near = await api().get("/api/providers?lat=31.5&lng=74.3&q=%00");
    expect(near.status).toBe(400);
  });

  it("still answers the filters the apps send", async () => {
    await createProvider("a", { name: "Corner Store", type: "store", category: "Grocery" });
    await createProvider("b", { name: "Plumber", type: "service", category: "plumber" });
    expect((await api().get("/api/providers?type=service")).body.map((p: { name: string }) => p.name)).toEqual(["Plumber"]);
    expect((await api().get("/api/providers?category=grocery&category=plumber")).body).toHaveLength(2);
    expect((await api().get("/api/providers?q=corner")).body.map((p: { name: string }) => p.name)).toEqual(["Corner Store"]);
  });

  it("refuses search input the database can't take", async () => {
    for (const query of ["q=%00", "q=a&q=b", "type=everything"]) {
      expect((await api().get(`/api/search?${query}`)).status, query).toBe(400);
    }
    expect((await api().get("/api/search?q=corner")).status).toBe(200);
  });
});

describe("what a seller can save", () => {
  beforeEach(resetDatabase);

  it("refuses a pin at exactly 0,0, the reading of a device that has none", async () => {
    const created = await api()
      .post("/api/providers")
      .set(SIGNED_IN_AS, SELLER)
      .send({ name: "Null Island", type: "store", lat: 0, lng: 0 });
    expect(created.status).toBe(400);

    await createProvider(SELLER, { name: "Shop" });
    const edited = await api().patch("/api/providers/me").set(SIGNED_IN_AS, SELLER).send({ lat: 0, lng: 0 });
    expect(edited.status).toBe(400);
  });

  it("refuses a description long enough to bloat every list near the shop", async () => {
    await createProvider(SELLER, { name: "Shop" });
    const res = await api().patch("/api/providers/me").set(SIGNED_IN_AS, SELLER).send({ description: "x".repeat(2001) });
    expect(res.status).toBe(400);
    const ok = await api().patch("/api/providers/me").set(SIGNED_IN_AS, SELLER).send({ description: "x".repeat(2000) });
    expect(ok.status).toBe(200);
  });

  it("keeps rows written outside the API in range", async () => {
    for (const fields of [
      { lat: "91.0000000", lng: "74.0000000" },
      { lat: "31.0000000", lng: "181.0000000" },
      { lat: "31.0000000" }, // half a pin
      { deliveryRadiusKm: "999.9" },
      { deliveryRadiusKm: "0" },
      { deliveryRadiusKm: "NaN" }, // Postgres sorts NaN above every number: it would reach everyone
    ]) {
      await expect(createProvider("x", { name: "x", ...fields }), JSON.stringify(fields)).rejects.toThrow();
    }
    await expect(createProvider("ok", { name: "ok", lat: "31.5204000", lng: "74.3587000", deliveryRadiusKm: "50" })).resolves.toBeTruthy();
  });
});

describe("suggestions with nothing usable to go on", () => {
  beforeEach(() => {
    // Were the paid AI service reached, it would fail here (502) instead of answering.
    vi.stubEnv("AI_INTEGRATIONS_OPENAI_BASE_URL", "");
    vi.stubEnv("AI_INTEGRATIONS_OPENAI_API_KEY", "");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("answers an empty list without calling the AI service", async () => {
    const bodies = [
      {},
      {
        pastPurchases: "milk",
        nearbyStores: [{ storeName: 5, products: "bread" }, null, { storeName: "Shop", products: [] }],
        userLocation: { latitude: "31.5", longitude: 999 },
      },
    ];
    for (const body of bodies) {
      const res = await api().post("/api/ai/recommendations").send(body);
      expect(res.status, JSON.stringify(body)).toBe(200);
      expect(res.body).toEqual({ recommendations: [] });
    }
  });
});
