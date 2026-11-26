import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, GitCompareArrows, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_BY_ID } from "@/data/brands";
import { CARS, type Car } from "@/data/cars";
import { years } from "@/lib/catalog";
import { SPEC_GROUPS } from "@/lib/specs";
import { useAvtoStore } from "@/lib/avto-store";
import { SmartImage } from "./SmartImage";
import { CarCard } from "./CarCard";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export function CarDetail({ car }: { car: Car }) {
  const { compareIds, toggle } = useAvtoStore();
  const { t, tv, lang } = useT();
  const compared = compareIds.includes(car.id);
  const [index, setIndex] = useState(0);
  const total = car.images.length;
  const brand = BRAND_BY_ID[car.brand];
  const title = `${brand.name} ${car.model} ${car.generation}`;

  useEffect(() => setIndex(0), [car.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  // Current photo first; the rest act as onError fallbacks.
  const rotated = [...car.images.slice(index), ...car.images.slice(0, index)];
  const siblings = CARS.filter((c) => c.brand === car.brand && c.id !== car.id)
    .sort((a, b) => Number(b.model === car.model) - Number(a.model === car.model))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6">
      <Button variant="glass" size="sm" asChild>
        <Link to="/kataloq">
          <ArrowLeft /> {t("Kataloqa qayıt")}
        </Link>
      </Button>

      {/* Gallery */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_120px]">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted">
          <SmartImage
            key={`${car.id}-${index}`}
            srcs={rotated}
            alt={`${title} — foto ${index + 1}`}
            loading="eager"
            className="h-full w-full object-cover animate-in fade-in duration-300"
          />
          {total > 1 && (
            <>
              <button
                onClick={() => setIndex((i) => (i - 1 + total) % total)}
                className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/80 backdrop-blur transition hover:bg-background"
                aria-label={t("Əvvəlki foto")}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIndex((i) => (i + 1) % total)}
                className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/80 backdrop-blur transition hover:bg-background"
                aria-label={t("Növbəti foto")}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          <span className="absolute bottom-3 right-3 rounded-md bg-background/80 px-2 py-0.5 font-mono text-xs backdrop-blur">
            {index + 1} / {total}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 lg:max-h-[min(56vw,640px)] lg:grid-cols-1 lg:overflow-y-auto lg:pr-1 scrollbar-thin">
          {car.images.map((src, i) => (
            <button
              key={src}
              onClick={() => setIndex(i)}
              className={cn(
                "aspect-[4/3] overflow-hidden rounded-md border-2 transition",
                i === index ? "border-primary" : "border-transparent opacity-60 hover:opacity-100",
              )}
              aria-label={`Foto ${i + 1}`}
            >
              <SmartImage srcs={[src, ...car.images.filter((s) => s !== src)]} alt={`${title} — kiçik foto ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">{t("Fotolar: Wikimedia Commons")}</p>

      {/* Title + quick facts */}
      <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">{brand.name} · {t(brand.country)}</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
            {car.model} <span className="text-primary">{car.generation}</span>
          </h1>
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            {tv(years(car))} · {car.trim} · {t(car.body)} · {t(car.fuel)} · {t(car.era === "klassik" ? "Klassik" : "Yeni nəsil")}
          </p>
        </div>
        <Button variant={compared ? "glass" : "hero"} size="lg" onClick={() => toggle(car.id)}>
          {compared ? <Check /> : <GitCompareArrows />}
          {t(compared ? "Müqayisədən çıxar" : "Müqayisəyə əlavə et")}
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Güc", `${car.hp} a.g.`],
          ["Fırlanma momenti", `${car.nm} Nm`],
          ["0–100 km/saat", `${car.acc} san`],
          ["Maksimal sürət", `${car.vmax} km/saat`],
        ].map(([l, v]) => (
          <div key={l} className="surface p-4">
            <div className="font-display text-xl font-bold text-primary">{tv(v ?? "")}</div>
            <div className="mt-1 text-xs text-muted-foreground">{t(l ?? "")}</div>
          </div>
        ))}
      </div>

      {/* Specs + history */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-4 md:grid-cols-2">
          {SPEC_GROUPS.map((g) => (
            <section key={g.title} className="surface overflow-hidden">
              <h2 className="border-b border-border bg-secondary/40 px-4 py-3 font-sans text-sm font-semibold">{t(g.title)}</h2>
              <table className="w-full text-sm">
                <tbody>
                  {g.rows.map((r) => (
                    <tr key={r.label} className="border-b border-border last:border-0">
                      <th scope="row" className="w-2/5 px-4 py-2.5 text-left font-normal text-muted-foreground">{t(r.label)}</th>
                      <td className="px-4 py-2.5 text-right font-mono text-[13px] font-medium">{t(tv(r.value(car)))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>
        <aside className="surface h-fit p-5 lg:sticky lg:top-20">
          <h2 className="flex items-center gap-2 font-sans text-base font-semibold">
            <History className="h-4 w-4 text-primary" /> {t("Qısa tarixçə")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{car.history}</p>
          {lang !== "az" && <p className="mt-2 text-[11px] italic text-muted-foreground">{t("Tarixçə mətni Azərbaycan dilindədir.")}</p>}
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">{t("Marka")}</dt><dd>{brand.name}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">{t("Mərkəz")}</dt><dd>{t(brand.hq)}, {t(brand.country)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">{t("Təsis ili")}</dt><dd className="font-mono">{brand.founded}</dd></div>
          </dl>
        </aside>
      </div>

      {siblings.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold">{t("{b} — digər modellər", { b: brand.name })}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {siblings.map((c) => (
              <CarCard key={c.id} car={c} compared={compareIds.includes(c.id)} onToggleCompare={() => toggle(c.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
