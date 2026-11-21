import { describe, expect, it } from "vitest";
import { CARS } from "@/data/cars";
import { EMPTY_FILTERS, filterCars, generationsFor, modelsFor, toggleCompare, updateFilters } from "@/lib/catalog";

describe("catalog rules", () => {
  it("brand selection limits models to that brand only", () => {
    expect(modelsFor(CARS, "lada").sort()).toEqual(["Jiquli (Klassika)", "Niva", "Priora", "Vesta"].sort());
  });

  it("model selection lists only that model's generations", () => {
    expect(generationsFor(CARS, "bmw", "3 Series").map((c) => c.generation)).toEqual(["E30", "E36", "E46", "G20"]);
  });

  it("changing brand clears model and generation", () => {
    const f = updateFilters({ ...EMPTY_FILTERS, brand: "bmw", model: "3 Series", generation: "bmw-e30" }, { brand: "audi" });
    expect([f.model, f.generation]).toEqual(["", ""]);
  });

  it("choosing a brand filters the catalog grid directly to that brand", () => {
    const res = filterCars(CARS, updateFilters(EMPTY_FILTERS, { brand: "porsche" }));
    expect(res.length).toBe(6);
    expect(res.every((c) => c.brand === "porsche")).toBe(true);
  });

  it("compare list holds at most 4 cars", () => {
    const four = ["a", "b", "c", "d"];
    expect(toggleCompare(four, "e")).toEqual({ ids: four, rejected: true });
  });

  it("every car has at least 6 photos for the gallery", () => {
    expect(CARS.filter((c) => c.images.length < 6).map((c) => c.id)).toEqual([]);
  });
});
