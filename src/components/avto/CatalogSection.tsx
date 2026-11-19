import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CARS, type Car } from "@/data/cars";
import { filterCars, type Filters } from "@/lib/catalog";
import { CarCard } from "./CarCard";
import { ComparePanel } from "./ComparePanel";
import { FilterPanel } from "./FilterPanel";

type Sort = "brand" | "newest" | "oldest" | "power" | "accel";
const SORTS: Record<Sort, { label: string; fn: (a: Car, b: Car) => number }> = {
  brand: { label: "Marka üzrə", fn: () => 0 },
  newest: { label: "Ən yeni", fn: (a, b) => b.from - a.from },
  oldest: { label: "Ən köhnə", fn: (a, b) => a.from - b.from },
  power: { label: "Ən güclü", fn: (a, b) => b.hp - a.hp },
  accel: { label: "Ən sürətli (0–100)", fn: (a, b) => a.acc - b.acc },
};

interface Props {
  filters: Filters;
  onFiltersChange: (patch: Partial<Filters>) => void;
  onResetFilters: () => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onClearCompare: () => void;
  onOpenCar: (id: string) => void;
}

const PAGE = 12;

export function CatalogSection(p: Props) {
  const [sort, setSort] = useState<Sort>("brand");
  const [limit, setLimit] = useState(PAGE);
  const results = useMemo(() => [...filterCars(CARS, p.filters)].sort(SORTS[sort].fn), [p.filters, sort]);
  const visible = results.slice(0, limit);

  return (
    <section id="kataloq" className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Kataloq</p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Sürətli filtr və texniki kataloq</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{results.length}</span> nəticə
            </span>
            <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
              <SelectTrigger className="h-9 w-48 bg-secondary/50" aria-label="Sıralama">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SORTS).map(([k, s]) => (
                  <SelectItem key={k} value={k}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[300px_1fr]">
          <FilterPanel
            filters={p.filters}
            onChange={(patch) => {
              setLimit(PAGE);
              p.onFiltersChange(patch);
            }}
            onReset={p.onResetFilters}
          />

          <div>
            {results.length === 0 ? (
              <div className="surface flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
                <SearchX className="h-10 w-10 text-muted-foreground" />
                <p className="font-display font-bold">Uyğun avtomobil tapılmadı</p>
                <p className="text-sm text-muted-foreground">Filtrləri genişləndirin və ya sıfırlayın.</p>
                <Button variant="glass" onClick={p.onResetFilters}>
                  Filtrləri sıfırla
                </Button>
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {visible.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      compared={p.compareIds.includes(car.id)}
                      onOpen={() => p.onOpenCar(car.id)}
                      onToggleCompare={() => p.onToggleCompare(car.id)}
                    />
                  ))}
                </div>
                {results.length > limit && (
                  <div className="mt-8 text-center">
                    <Button variant="glass" size="lg" onClick={() => setLimit((l) => l + PAGE)}>
                      Daha çox göstər ({results.length - limit})
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <ComparePanel
          ids={p.compareIds}
          onAdd={(id) => p.onToggleCompare(id)}
          onRemove={(id) => p.onToggleCompare(id)}
          onClear={p.onClearCompare}
          onOpen={p.onOpenCar}
        />
      </div>
    </section>
  );
}
