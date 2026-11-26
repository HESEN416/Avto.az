import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BRANDS, type BrandId } from "@/data/brands";
import { CARS, type BodyType, type Era, type FuelType } from "@/data/cars";
import { useT } from "@/lib/i18n";
import { HP_LIMITS, activeFilterCount, generationsFor, modelsFor, type Filters } from "@/lib/catalog";

const ALL = "__all";
const BODIES: BodyType[] = ["Sedan", "Hetçbek", "Kupe", "Liftbek", "Krossover", "SUV"];
const FUELS: FuelType[] = ["Benzin", "Dizel", "Hibrid", "Elektrik"];

interface Props {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function FilterSelect<T extends string>({
  value,
  onChange,
  placeholder,
  options,
  disabled,
  label,
}: {
  value: T | "";
  onChange: (v: T | "") => void;
  placeholder: string;
  options: { value: T; label: string }[];
  disabled?: boolean;
  label: string;
}) {
  return (
    <Select value={value || ALL} onValueChange={(v) => onChange(v === ALL ? "" : (v as T))} disabled={disabled ?? false}>
      <SelectTrigger className="h-10 bg-secondary/50" aria-label={label}>
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

/** Compact two-row horizontal filter bar shown above the catalog grid. */
export function FilterBar({ filters, onChange, onReset }: Props) {
  const models = modelsFor(CARS, filters.brand);
  const gens = generationsFor(CARS, filters.brand, filters.model);
  const active = activeFilterCount(filters);
  const { t, tv } = useT();

  return (
    <div className="surface space-y-4 p-4 sm:p-5" role="search" aria-label={t("Filtrlər")}>
      {/* Row 1: brand, model, generation, category, search */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr_auto_1.3fr] lg:items-end">
        <Field label={t("Marka")}>
          <FilterSelect<BrandId>
            label={t("Marka")}
            value={filters.brand}
            onChange={(v) => onChange({ brand: v })}
            placeholder={t("Bütün markalar")}
            options={BRANDS.map((b) => ({ value: b.id, label: b.name }))}
          />
        </Field>
        <Field label={t("Model")}>
          <FilterSelect
            label={t("Model")}
            value={filters.model}
            onChange={(v) => onChange({ model: v })}
            placeholder={t(filters.brand ? "Bütün modellər" : "Əvvəlcə marka seçin")}
            options={models.map((m) => ({ value: m, label: m }))}
            disabled={!filters.brand}
          />
        </Field>
        <Field label={t("İl / Nəsil")}>
          <FilterSelect
            label={t("İl / Nəsil")}
            value={filters.generation}
            onChange={(v) => onChange({ generation: v })}
            placeholder={t(filters.model ? "Bütün nəsillər" : "Əvvəlcə model seçin")}
            options={gens.map((g) => ({ value: g.id, label: `${g.generation} (${g.from}–${g.to ?? tv("hazırda")})` }))}
            disabled={!filters.model}
          />
        </Field>
        <Field label={t("Kateqoriya")}>
          <div className="grid h-10 grid-cols-3 gap-1">
            {([["", "Hamısı"], ["klassik", "Köhnə"], ["yeni", "Yeni"]] as [Era | "", string][]).map(([v, l]) => (
              <Button
                key={l}
                type="button"
                variant="chip"
                className="h-10 px-3"
                data-active={filters.era === v}
                aria-pressed={filters.era === v}
                onClick={() => onChange({ era: v })}
              >
                {t(l)}
              </Button>
            ))}
          </div>
        </Field>
        <Field label={t("Axtarış")}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.query}
              onChange={(e) => onChange({ query: e.target.value })}
              placeholder={t("Model və ya nəsil…")}
              className="h-10 bg-secondary/50 pl-9"
              aria-label={t("Axtarış")}
            />
          </div>
        </Field>
      </div>

      {/* Row 2: body, fuel, horsepower, reset */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2.2fr_auto] lg:items-end">
        <Field label={t("Ban növü")}>
          <FilterSelect<BodyType>
            label={t("Ban növü")}
            value={filters.body}
            onChange={(v) => onChange({ body: v })}
            placeholder={t("Bütün ban növləri")}
            options={BODIES.map((b) => ({ value: b, label: t(b) }))}
          />
        </Field>
        <Field label={t("Yanacaq növü")}>
          <FilterSelect<FuelType>
            label={t("Yanacaq növü")}
            value={filters.fuel}
            onChange={(v) => onChange({ fuel: v })}
            placeholder={t("Bütün yanacaq növləri")}
            options={FUELS.map((f) => ({ value: f, label: t(f) }))}
          />
        </Field>
        <Field label={t("At gücü aralığı")}>
          <div className="flex h-10 items-center gap-4 rounded-md border border-input bg-secondary/50 px-4">
            <Slider
              min={HP_LIMITS.min}
              max={HP_LIMITS.max}
              step={10}
              value={[filters.hpMin, filters.hpMax]}
              onValueChange={([a, b]) => onChange({ hpMin: a ?? HP_LIMITS.min, hpMax: b ?? HP_LIMITS.max })}
              aria-label={t("At gücü aralığı")}
            />
            <span className="shrink-0 font-mono text-xs font-semibold">
              {filters.hpMin}–{filters.hpMax}{tv(" a.g.")}
            </span>
          </div>
        </Field>
        <Button variant="glass" className="h-10" onClick={onReset} disabled={active === 0}>
          <RotateCcw /> {t("Sıfırla")}
          {active > 0 && (
            <span className="rounded-full bg-primary px-1.5 font-mono text-[10px] text-primary-foreground">{active}</span>
          )}
        </Button>
      </div>
    </div>
  );
}
