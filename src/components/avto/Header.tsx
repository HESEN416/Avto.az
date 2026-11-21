import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CarFront, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAvtoStore } from "@/lib/avto-store";

const NAV = [
  { to: "/", label: "Ana səhifə" },
  { to: "/kataloq", label: "Kataloq" },
  { to: "/markalar", label: "Markalar" },
  { to: "/muqayise", label: "Müqayisə" },
] as const;

function ThemeToggle() {
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
      aria-label={light ? "Tünd rejimə keç" : "İşıqlı rejimə keç"}
      title={light ? "Tünd rejim" : "İşıqlı rejim"}
    >
      {light ? <Moon /> : <Sun />}
    </Button>
  );
}

export function Header() {
  const { compareIds } = useAvtoStore();

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

        <nav className="ml-auto flex items-center gap-0.5 overflow-x-auto scrollbar-thin" aria-label="Əsas menyu">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="relative whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary sm:px-3.5"
            >
              {n.label}
              {n.to === "/muqayise" && compareIds.length > 0 && (
                <span className="ml-1.5 inline-grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 font-mono text-[10px] font-semibold text-primary-foreground">
                  {compareIds.length}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
