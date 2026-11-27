import { describe, expect, it } from "vitest";
import { COUNTRIES, COUNTRY_BY_ID, clean } from "@/lib/plate";
import { translate } from "@/lib/i18n";

const az = COUNTRY_BY_ID.az;

describe("plate rules", () => {
  it("region code keeps only 2 digits", () => expect(clean("digits", 2, "9a95")).toBe("99"));
  it("series keeps uppercase Latin letters only", () => expect(clean("letters", 2, "x1əbz")).toBe("XB"));
  it("AZ plate has no dashes, spaces between parts", () =>
    expect(az.main({ region: "22", series: "NK", number: "222" })).toBe("22 NK 222"));
  it("AZ number is zero-padded to 3 digits", () => expect(az.main({ region: "10", series: "AA", number: "1" })).toBe("10 AA 001"));
  it("AZ random plate follows 2 digits, 2 letters, 3 digits", () => {
    for (let i = 0; i < 50; i++) expect(az.main(az.random(Math.random))).toMatch(/^\d{2} [A-Z]{2} \d{3}$/);
  });
  it("Azerbaijan is the default (first) country", () => expect(COUNTRIES[0]?.id).toBe("az"));
  it("every country's random plate fits its own fields", () => {
    for (const c of COUNTRIES) {
      const v = c.random(Math.random);
      for (const fl of c.fields) expect(clean(fl.kind, fl.max, v[fl.key] ?? "")).toBe(v[fl.key]);
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
