import { Link } from "@tanstack/react-router";
import { Plus, Trash2, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRANDS, BRAND_BY_ID } from "@/data/brands";
import { CARS, CAR_BY_ID, type Car } from "@/data/cars";
import { MAX_COMPARE, MIN_COMPARE, years } from "@/lib/catalog";
import { SPEC_GROUPS, bestIndex } from "@/lib/specs";
import { SmartImage } from "./SmartImage";
import { cn } from "@/lib/utils";

import { useAvtoStore } from "@/lib/avto-store";
import { useT } from "@/lib/i18n";

function AddSlot({ ids, onAdd }: { ids: string[]; onAdd: (id: string) => void }) {
  const { t } = useT();
  return (
    <div className="flex h-full min-h-44 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-4 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
        <Plus className="h-5 w-5" />
      </span>
      <Select value="" onValueChange={onAdd}>
        <SelectTrigger className="h-9 w-full bg-secondary/50 text-xs">
          <SelectValue placeholder={t("Avtomobil əlavə et")} />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {BRANDS.map((b) => (
            <SelectGroup key={b.id}>
              <SelectLabel className="text-primary">{b.name}</SelectLabel>
              {CARS.filter((c) => c.brand === b.id && !ids.includes(c.id)).map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.model} {c.generation} ({c.from})
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ComparePanel() {
  const { compareIds: ids, toggle, clearCompare: onClear } = useAvtoStore();
  const { t, tv } = useT();
  const onAdd = toggle;
  const onRemove = toggle;
  const cars = ids.map((id) => CAR_BY_ID[id]).filter((c): c is Car => !!c);
  const slots = Math.min(MAX_COMPARE, Math.max(MIN_COMPARE, cars.length + 1));
  const cols = { gridTemplateColumns: `minmax(140px,1fr) repeat(${slots}, minmax(180px,1.2fr))` };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xl text-sm text-muted-foreground">
          {t("İstənilən marka və ildən {a}–{b} avtomobil seçin. Ən yaxşı göstərici yaşıl rənglə işarələnir.", { a: MIN_COMPARE, b: MAX_COMPARE })}
        </p>
        {cars.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <Trash2 /> {t("Hamısını təmizlə")}
          </Button>
        )}
      </div>

      <div className="surface mt-8 overflow-x-auto scrollbar-thin">
        <div className="min-w-[720px]">
          {/* Car headers */}
          <div className="grid gap-3 border-b border-border p-4" style={cols}>
            <div className="flex flex-col justify-end pb-2">
              <span className="font-mono text-xs text-muted-foreground">
                {t("{a} / {b} seçilib", { a: cars.length, b: MAX_COMPARE })}
              </span>
            </div>
            {Array.from({ length: slots }, (_, i) => {
              const car = cars[i];
              if (!car) return <AddSlot key={`add-${i}`} ids={ids} onAdd={onAdd} />;
              const brand = BRAND_BY_ID[car.brand];
              return (
                <div key={car.id} className="relative overflow-hidden rounded-xl border border-border bg-secondary/30">
                  <button
                    onClick={() => onRemove(car.id)}
                    className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-background/80 backdrop-blur transition hover:bg-destructive hover:text-destructive-foreground"
                    aria-label={`${car.model} — ${t("Müqayisədən çıxar")}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <Link to="/avtomobil/$id" params={{ id: car.id }} className="block w-full text-left">
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <SmartImage srcs={car.images} alt={`${brand.name} ${car.model} ${car.generation}`} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] text-muted-foreground">{brand.name}</p>
                      <p className="text-sm font-bold leading-tight">
                        {car.model} <span className="text-primary">{car.generation}</span>
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{tv(years(car))}</p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {cars.length < MIN_COMPARE && (
            <p className="border-b border-border px-4 py-3 text-center text-sm text-muted-foreground">
              {t("Müqayisə üçün ən azı {n} avtomobil seçin — kataloqdakı “Müqayisə et” düyməsi və ya yuxarıdakı “Avtomobil əlavə et” siyahısı ilə.", { n: MIN_COMPARE })}
            </p>
          )}

          {cars.length > 0 &&
            SPEC_GROUPS.map((g) => (
              <div key={g.title}>
                <div className="bg-secondary/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">{t(g.title)}</div>
                {g.rows.map((row) => {
                  const best = bestIndex(row, cars);
                  return (
                    <div key={row.label} className="grid gap-3 border-b border-border px-4 py-2.5 text-sm last:border-0" style={cols}>
                      <div className="text-muted-foreground">{t(row.label)}</div>
                      {Array.from({ length: slots }, (_, i) => {
                        const car = cars[i];
                        const win = best.includes(i);
                        return (
                          <div
                            key={i}
                            className={cn("font-mono text-[13px]", win && "flex items-center gap-1.5 font-semibold text-success")}
                          >
                            {car ? t(tv(row.value(car))) : <span className="text-muted-foreground/50">—</span>}
                            {win && <Trophy className="h-3.5 w-3.5 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
