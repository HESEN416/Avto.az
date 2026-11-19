import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BRANDS, type BrandId } from "@/data/brands";
import { CARS, type BodyType, type Era, type FuelType } from "@/data/cars";
import {
  ACC_LIMIT,
  HP_LIMITS,
  activeFilterCount,
  generationsFor,
  modelsFor,
  type Filters,
} from "@/lib/catalog";

const ALL = "__all";
const BODIES: BodyType[] = ["Sedan", "Hetçbek", "Kupe", "Liftbek", "Krossover", "SUV"];
const FUELS: FuelType[] = ["Benzin", "Dizel", "Hibrid", "Elektrik"];

interface Props {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function FilterSelect<T extends string>({
  value,
  onChange,
  placeholder,
  options,
  disabled,
}: {
  value: T | "";
  onChange: (v: T | "") => void;
  placeholder: string;
  options: { value: T; label: string }[];
  disabled?: boolean;
}) {
  return (
    <Select value={value || ALL} onValueChange={(v) => onChange(v === ALL ? "" : (v as T))} disabled={disabled}>
      <SelectTrigger className="h-10 bg-secondary/50">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectItem value={ALL}>{placeholder}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function FilterPanel({ filters, onChange, onReset }: Props) {
  const models = modelsFor(CARS, filters.brand);
  const gens = generationsFor(CARS, filters.brand, filters.model);
  const active = activeFilterCount(filters);

  return (
    <aside className="surface p-5 lg:sticky lg:top-20" aria-label="Filtrlər">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold">
          <SlidersHorizontal className="h-4 w-4 text-primary" /> Sürətli filtr
          {active > 0 && (
            <span className="rounded-full bg-primary px-1.5 font-mono text-[10px] text-primary-foreground">{active}</span>
          )}
        </h3>
        <Button variant="ghost" size="sm" onClick={onReset} disabled={active === 0}>
          <RotateCcw /> Sıfırla
        </Button>
      </div>

      <div className="mt-5 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder="Model və ya nəsil axtar…"
            className="h-10 bg-secondary/50 pl-9"
            aria-label="Axtarış"
          />
        </div>

        <Field label="Marka">
          <FilterSelect<BrandId>
            value={filters.brand}
            onChange={(v) => onChange({ brand: v })}
            placeholder="Bütün markalar"
            options={BRANDS.map((b) => ({ value: b.id, label: b.name }))}
          />
        </Field>
        <Field label="Model">
          <FilterSelect
            value={filters.model}
            onChange={(v) => onChange({ model: v })}
            placeholder={filters.brand ? "Bütün modellər" : "Əvvəlcə marka seçin"}
            options={models.map((m) => ({ value: m, label: m }))}
            disabled={!filters.brand}
          />
        </Field>
        <Field label="İl / Nəsil">
          <FilterSelect
            value={filters.generation}
            onChange={(v) => onChange({ generation: v })}
            placeholder={filters.model ? "Bütün nəsillər" : "Əvvəlcə model seçin"}
            options={gens.map((g) => ({ value: g.id, label: `${g.generation} (${g.from}–${g.to ?? "hazırda"})` }))}
            disabled={!filters.model}
          />
        </Field>

        <Field label="Kateqoriya">
          <div className="grid grid-cols-3 gap-1.5">
            {([["", "Hamısı"], ["klassik", "Köhnə"], ["yeni", "Yeni"]] as [Era | "", string][]).map(([v, l]) => (
              <Button
                key={l}
                type="button"
                variant="chip"
                size="sm"
                data-active={filters.era === v}
                onClick={() => onChange({ era: v })}
              >
                {l}
              </Button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Ban növü">
            <FilterSelect<BodyType>
              value={filters.body}
              onChange={(v) => onChange({ body: v })}
              placeholder="Hamısı"
              options={BODIES.map((b) => ({ value: b, label: b }))}
            />
          </Field>
          <Field label="Yanacaq növü">
            <FilterSelect<FuelType>
              value={filters.fuel}
              onChange={(v) => onChange({ fuel: v })}
              placeholder="Hamısı"
              options={FUELS.map((f) => ({ value: f, label: f }))}
            />
          </Field>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">At gücü</span>
            <span className="font-mono font-semibold">
              {filters.hpMin} – {filters.hpMax} a.g.
            </span>
          </div>
          <Slider
            min={HP_LIMITS.min}
            max={HP_LIMITS.max}
            step={10}
            value={[filters.hpMin, filters.hpMax]}
            onValueChange={([a, b]) => onChange({ hpMin: a, hpMax: b })}
            aria-label="At gücü aralığı"
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">0–100 km/s (maks.)</span>
            <span className="font-mono font-semibold">≤ {filters.accMax} san</span>
          </div>
          <Slider
            min={3}
            max={ACC_LIMIT}
            step={0.5}
            value={[filters.accMax]}
            onValueChange={([v]) => onChange({ accMax: v })}
            aria-label="0–100 sürətlənmə"
          />
        </div>
      </div>
    </aside>
  );
}
