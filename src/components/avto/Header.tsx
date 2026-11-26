import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CarFront, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAvtoStore } from "@/lib/avto-store";
import { LANGS, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Ana səhifə" },
  { to: "/kataloq", label: "Kataloq" },
  { to: "/markalar", label: "Markalar" },
  { to: "/muqayise", label: "Müqayisə" },
  { to: "/oz-nomrem", label: "Öz nömrəm" },
] as const;

function LangSwitch() {
  const { lang, setLang, t } = useT();
  return (
    <div role="group" aria-label={t("Dil seçimi")} className="flex shrink-0 items-center rounded-md border border-border bg-secondary/40 p-0.5 font-mono text-[11px] font-semibold">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn("rounded px-1.5 py-1 uppercase transition-colors sm:px-2", lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function ThemeToggle() {
  const { t } = useT();
  const [light, setLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("avto-theme") === "light";
    setLight(saved);
    document.documentElement.classList.toggle("dark", !saved);
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("dark", !next);
    localStorage.setItem("avto-theme", next ? "light" : "dark");
  };

  return (
    <Button
      variant="glass"
      size="icon"
      onClick={toggle}
      aria-label={t(light ? "Tünd rejimə keç" : "İşıqlı rejimə keç")}
      title={t(light ? "Tünd rejimə keç" : "İşıqlı rejimə keç")}
    >
      {light ? <Moon /> : <Sun />}
    </Button>
  );
}

export function Header() {
  const { compareIds } = useAvtoStore();
  const { t } = useT();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Avto.az — ana səhifə">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-accent text-primary-foreground shadow-glow">
            <CarFront className="h-5 w-5" />
          </span>
          <span className="hidden font-display text-lg font-bold tracking-tight sm:inline">
            Avto<span className="text-primary">.az</span>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-0.5 overflow-x-auto scrollbar-thin" aria-label={t("Əsas menyu")}>
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="relative whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary sm:px-3.5"
            >
              {t(n.label)}
              {n.to === "/muqayise" && compareIds.length > 0 && (
                <span className="ml-1.5 inline-grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 font-mono text-[10px] font-semibold text-primary-foreground">
                  {compareIds.length}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <LangSwitch />
        <ThemeToggle />
      </div>
    </header>
  );
}
