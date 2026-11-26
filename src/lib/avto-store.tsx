import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useT } from "./i18n";
import { EMPTY_FILTERS, MAX_COMPARE, toggleCompare, updateFilters, type Filters } from "./catalog";

export type Sort = "brand" | "newest" | "oldest" | "power" | "accel";

interface AvtoStore {
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: (patch?: Partial<Filters>) => void;
  sort: Sort;
  setSort: (s: Sort) => void;
  compareIds: string[];
  toggle: (id: string) => void;
  clearCompare: () => void;
}

const Ctx = createContext<AvtoStore | null>(null);
const COMPARE_KEY = "avto-compare";

/** Catalog filters and the compare list live above the routes so they survive page changes. */
export function AvtoStoreProvider({ children }: { children: ReactNode }) {
  const { t } = useT();
  const [filters, setFiltersState] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<Sort>("brand");
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(COMPARE_KEY) ?? "[]");
      if (Array.isArray(saved)) setCompareIds(saved.filter((x) => typeof x === "string").slice(0, MAX_COMPARE));
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const persist = (ids: string[]) => {
    setCompareIds(ids);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
  };

  const value: AvtoStore = {
    filters,
    setFilters: (patch) => setFiltersState((f) => updateFilters(f, patch)),
    resetFilters: (patch) => setFiltersState(updateFilters(EMPTY_FILTERS, patch ?? {})),
    sort,
    setSort,
    compareIds,
    toggle: (id) => {
      const { ids, rejected } = toggleCompare(compareIds, id);
      if (rejected) {
        toast.error(t("Maksimum {n} avtomobil müqayisə etmək olar", { n: MAX_COMPARE }), {
          description: t("Yenisini əlavə etmək üçün birini çıxarın."),
        });
        return;
      }
      persist(ids);
    },
    clearCompare: () => persist([]),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAvtoStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAvtoStore must be used inside AvtoStoreProvider");
  return v;
}
