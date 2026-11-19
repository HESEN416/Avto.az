import { useEffect, useState } from "react";
import { CarFront, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const NAV = [
  { id: "kataloq", label: "Kataloq" },
  { id: "markalar", label: "Markalar" },
  { id: "muqayise", label: "Müqayisə" },
];

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

export function Header({ compareCount }: { compareCount: number }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex items-center gap-2.5"
          aria-label="Avto.az — yuxarı qayıt"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-accent text-primary-foreground shadow-glow">
            <CarFront className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Avto<span className="text-primary">.az</span>
          </span>
        </button>

        <nav className="ml-auto flex items-center gap-1" aria-label="Əsas menyu">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => scrollToSection(n.id)}
              className="relative rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-3.5"
            >
              {n.label}
              {n.id === "muqayise" && compareCount > 0 && (
                <span className="ml-1.5 inline-grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 font-mono text-[10px] font-semibold text-primary-foreground">
                  {compareCount}
                </span>
              )}
            </button>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
