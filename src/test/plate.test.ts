import { describe, expect, it } from "vitest";
import { cleanNumber, cleanRegion, cleanSeries, plateText, randomPlate } from "@/lib/plate";
import { translate } from "@/lib/i18n";

describe("plate rules", () => {
  it("region code keeps only 2 digits", () => expect(cleanRegion("9a95")).toBe("99"));
  it("series keeps 2 uppercase Latin letters", () => expect(cleanSeries("x1əbz")).toBe("XB"));
  it("number keeps only 3 digits", () => expect(cleanNumber("7-7-7-1")).toBe("777"));
  it("number is zero-padded to 3 digits", () => expect(plateText({ region: "10", series: "AA", number: "1" }).number).toBe("001"));
  it("random plate follows 2-2-3 format", () => {
    for (let i = 0; i < 50; i++) {
      const p = randomPlate();
      expect(`${p.region}-${p.series}-${p.number}`).toMatch(/^\d{2}-[A-Z]{2}-\d{3}$/);
    }
  });
});

describe("languages", () => {
  it("AZ is returned unchanged", () => expect(translate("az", "Kataloq")).toBe("Kataloq"));
  it("EN and RU translate", () => {
    expect(translate("en", "Kataloq")).toBe("Catalog");
    expect(translate("ru", "Kataloq")).toBe("Каталог");
  });
});
