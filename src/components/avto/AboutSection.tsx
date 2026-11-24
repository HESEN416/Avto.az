import { Archive, BadgeCheck, BookOpenCheck, Gauge, Mail, MapPin } from "lucide-react";

const ICONS = [
  { icon: Gauge, label: "Dəqiq zavod göstəriciləri" },
  { icon: Archive, label: "Klassik və müasir arxiv" },
  { icon: BookOpenCheck, label: "100% məlumat yönümlü" },
];

const CONTACT = [
  { icon: Mail, label: "E-poçt", value: "info@avto.az", href: "mailto:info@avto.az" },
  { icon: MapPin, label: "Yerləşmə", value: "Bakı, Azərbaycan" },
  { icon: BadgeCheck, label: "Status", value: "Məlumat və texniki kataloq layihəsi" },
];

/** Home page only: dark, logo-free block under the hero — site info on the left, contact on the right. */
export function AboutSection() {
  return (
    <section id="haqqimizda" className="dark scroll-mt-20 border-t border-border bg-about text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="eyebrow">Haqqımızda</p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Avto.az haqqında</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Avto.az — qlobal avtomobil sənayesinin klassik və müasir modellərini bir araya gətirən məlumat kataloqu
              və texniki ensiklopediyadır. Layihə heç bir satış və reklam yönümlü məqsəd daşımadan dəqiq texniki
              göstəriciləri, nəsilləri və zavod foto arxivini təqdim edir.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {ICONS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  role="img"
                  aria-label={label}
                  title={label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-about-panel text-primary ring-1 ring-border"
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-about-panel p-6 ring-1 ring-border sm:p-7">
            <h3 className="font-mono text-xs font-semibold tracking-[0.18em] text-primary">Əlaqə</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Təklif, texniki qeyd və ya məlumat dəqiqləşdirməsi üçün bizimlə əlaqə saxlayın.
            </p>
            <ul className="mt-5 space-y-3.5">
              {CONTACT.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-background/60 text-primary ring-1 ring-border">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {label}
                    </span>
                    {href ? (
                      <a href={href} className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-foreground">{value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
