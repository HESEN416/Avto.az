import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, GitCompareArrows, History } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BRAND_BY_ID } from "@/data/brands";
import type { Car } from "@/data/cars";
import { years } from "@/lib/catalog";
import { SPEC_GROUPS } from "@/lib/specs";
import { SmartImage } from "./SmartImage";
import { cn } from "@/lib/utils";

interface Props {
  car: Car | null;
  compared: boolean;
  onClose: () => void;
  onToggleCompare: () => void;
}

export function CarModal({ car, compared, onClose, onToggleCompare }: Props) {
  const [index, setIndex] = useState(0);
  const total = car?.images.length ?? 0;

  useEffect(() => setIndex(0), [car?.id]);

  useEffect(() => {
    if (!car) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [car, total]);

  if (!car) return null;
  const brand = BRAND_BY_ID[car.brand];
  const title = `${brand.name} ${car.model} ${car.generation}`;
  // Rotate the list so the current photo is first and the rest act as onError fallbacks.
  const rotated = [...car.images.slice(index), ...car.images.slice(0, index)];

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-6xl gap-0 overflow-y-auto border-border bg-card p-0 scrollbar-thin sm:rounded-2xl">
        <div className="grid lg:grid-cols-[1.35fr_1fr]">
          {/* Gallery */}
          <div className="bg-background/40 p-3 sm:p-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
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
                    className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/80 backdrop-blur transition hover:bg-background"
                    aria-label="Əvvəlki foto"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIndex((i) => (i + 1) % total)}
                    className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/80 backdrop-blur transition hover:bg-background"
                    aria-label="Növbəti foto"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <span className="absolute bottom-3 right-3 rounded-md bg-background/80 px-2 py-0.5 font-mono text-xs backdrop-blur">
                {index + 1} / {total}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
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
            <p className="mt-2 text-[11px] text-muted-foreground">Fotolar: Wikimedia Commons</p>
          </div>

          {/* Info */}
          <div className="p-5 sm:p-6">
            <p className="eyebrow">{brand.name} · {brand.country}</p>
            <DialogTitle className="mt-2 font-display text-2xl font-bold leading-tight">
              {car.model} <span className="text-primary">{car.generation}</span>
            </DialogTitle>
            <DialogDescription className="mt-1 font-mono text-xs">
              {years(car)} · {car.trim} · {car.body} · {car.fuel}
            </DialogDescription>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                ["Güc", `${car.hp} a.g.`],
                ["0–100", `${car.acc} san`],
                ["Maks.", `${car.vmax} km/s`],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg border border-border bg-secondary/50 p-3 text-center">
                  <div className="font-display text-lg font-bold text-primary">{v}</div>
                  <div className="text-[11px] text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-border bg-secondary/30 p-4">
              <h4 className="flex items-center gap-2 font-sans text-sm font-semibold">
                <History className="h-4 w-4 text-primary" /> Qısa tarixçə
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{car.history}</p>
            </div>

            <Button variant={compared ? "glass" : "hero"} className="mt-5 w-full" size="lg" onClick={onToggleCompare}>
              {compared ? <Check /> : <GitCompareArrows />}
              {compared ? "Müqayisədən çıxar" : "Müqayisəyə əlavə et"}
            </Button>
          </div>
        </div>

        {/* Full spec tables */}
        <div className="grid gap-4 border-t border-border p-5 sm:p-6 md:grid-cols-2">
          {SPEC_GROUPS.map((g) => (
            <section key={g.title} className="rounded-xl border border-border">
              <h4 className="border-b border-border bg-secondary/40 px-4 py-2.5 font-sans text-sm font-semibold">{g.title}</h4>
              <table className="w-full text-sm">
                <tbody>
                  {g.rows.map((r) => (
                    <tr key={r.label} className="border-b border-border last:border-0">
                      <th scope="row" className="w-2/5 px-4 py-2 text-left font-normal text-muted-foreground">{r.label}</th>
                      <td className="px-4 py-2 text-right font-mono text-[13px] font-medium">{r.value(car)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
