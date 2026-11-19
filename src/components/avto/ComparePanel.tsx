import { GitCompareArrows, Plus, Trash2, Trophy, X } from "lucide-react";
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
import { CARS, CAR_BY_ID } from "@/data/cars";
import { MAX_COMPARE, MIN_COMPARE, years } from "@/lib/catalog";
import { SPEC_GROUPS, bestIndex } from "@/lib/specs";
import { SmartImage } from "./SmartImage";
import { cn } from "@/lib/utils";

interface Props {
  ids: string[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpen: (id: string) => void;
}

function AddSlot({ ids, onAdd }: { ids: string[]; onAdd: (id: string) => void }) {
  return (
    <div className="flex h-full min-h-44 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-4 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
        <Plus className="h-5 w-5" />
      </span>
      <Select value="" onValueChange={onAdd}>
        <SelectTrigger className="h-9 w-full bg-secondary/50 text-xs">
          <SelectValue placeholder="Avtomobil əlavə et" />
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

export function ComparePanel({ ids, onAdd, onRemove, onClear, onOpen }: Props) {
  const cars = ids.map((id) => CAR_BY_ID[id]).filter(Boolean);
  const slots = Math.min(MAX_COMPARE, Math.max(MIN_COMPARE, cars.length + 1));
  const cols = { gridTemplateColumns: `minmax(140px,1fr) repeat(${slots}, minmax(180px,1.2fr))` };

  return (
    <div id="muqayise" className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Müqayisə aləti</p>
          <h2 className="mt-3 flex items-center gap-3 text-2xl font-bold sm:text-3xl">
            <GitCompareArrows className="h-7 w-7 text-primary" /> Yan-yana müqayisə
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            İstənilən marka və ildən {MIN_COMPARE}–{MAX_COMPARE} avtomobil seçin. Ən yaxşı göstərici{" "}
            <span className="text-success">yaşıl</span> rənglə işarələnir.
          </p>
        </div>
        {cars.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <Trash2 /> Hamısını təmizlə
          </Button>
        )}
      </div>

      <div className="surface mt-8 overflow-x-auto scrollbar-thin">
        <div className="min-w-[720px]">
          {/* Car headers */}
          <div className="grid gap-3 border-b border-border p-4" style={cols}>
            <div className="flex flex-col justify-end pb-2">
              <span className="font-mono text-xs text-muted-foreground">
                {cars.length} / {MAX_COMPARE} seçilib
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
                    aria-label={`${car.model} müqayisədən çıxar`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => onOpen(car.id)} className="block w-full text-left">
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <SmartImage srcs={car.images} alt={`${brand.name} ${car.model} ${car.generation}`} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] text-muted-foreground">{brand.name}</p>
                      <p className="text-sm font-bold leading-tight">
                        {car.model} <span className="text-primary">{car.generation}</span>
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{years(car)}</p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {cars.length < MIN_COMPARE && (
            <p className="border-b border-border px-4 py-3 text-center text-sm text-muted-foreground">
              Müqayisə üçün ən azı {MIN_COMPARE} avtomobil seçin — kataloqdakı “Müqayisə et” düyməsi və ya yuxarıdakı siyahı ilə.
            </p>
          )}

          {cars.length > 0 &&
            SPEC_GROUPS.map((g) => (
              <div key={g.title}>
                <div className="bg-secondary/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">{g.title}</div>
                {g.rows.map((row) => {
                  const best = bestIndex(row, cars);
                  return (
                    <div key={row.label} className="grid gap-3 border-b border-border px-4 py-2.5 text-sm last:border-0" style={cols}>
                      <div className="text-muted-foreground">{row.label}</div>
                      {Array.from({ length: slots }, (_, i) => {
                        const car = cars[i];
                        const win = best.includes(i);
                        return (
                          <div
                            key={i}
                            className={cn("font-mono text-[13px]", win && "flex items-center gap-1.5 font-semibold text-success")}
                          >
                            {car ? row.value(car) : <span className="text-muted-foreground/50">—</span>}
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
