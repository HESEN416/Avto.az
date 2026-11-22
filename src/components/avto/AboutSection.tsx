import { Archive, BookOpenCheck, Gauge } from "lucide-react";

const POINTS = [
  {
    icon: Gauge,
    title: "Dəqiq Zavod Göstəriciləri",
    text: "Mühərrik həcmi, at gücü, sürətlənmə və texniki parametrlər.",
  },
  {
    icon: Archive,
    title: "Klassik və Müasir Arxiv",
    text: "Əfsanəvi retro nəsillərdən ən yeni elektrik modellərinə qədər vahid baza.",
  },
  {
    icon: BookOpenCheck,
    title: "100% Məlumat Yönümlü",
    text: "Satış, elan və reklam olmadan yalnız təmiz ensiklopedik məlumat və müqayisə imkanı.",
  },
];

export function AboutSection() {
  return (
    <section id="haqqimizda" className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start">
          <div>
            <p className="eyebrow">Haqqımızda</p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Avto.az Haqqında</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Avto.az — qlobal avtomobil sənayesinin klassik və müasir modellərini bir araya gətirən müstəqil
              texniki ensiklopediya və məlumat kataloqudur. Məqsədimiz istifadəçilərə heç bir satış və reklam
              yönümlü müdaxilə olmadan dəqiq zavod göstəriciləri, mühərrik xüsusiyyətləri, nəsillərin tarixçəsi
              və real foto arxivləri təqdim etməkdir.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {POINTS.map((p) => (
              <div key={p.title} className="surface p-5 transition-colors hover:border-primary/50">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-sans text-base font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
