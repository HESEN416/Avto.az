import type { ReactNode } from "react";

export function PageIntro({ eyebrow, title, children, aside }: { eyebrow: string; title: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <div className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 py-10 sm:px-6">
        <div className="animate-rise">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h1>
          {children && <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{children}</p>}
        </div>
        {aside}
      </div>
    </div>
  );
}
