import { useEffect, useState, type ImgHTMLAttributes } from "react";

export const FALLBACK_IMAGE = "/images/fallback-car.jpg";

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "onError"> {
  /** Candidate photos, tried in order; the bundled fallback photo is always last. */
  srcs: string[];
  alt: string;
}

/** <img> that walks through backup photos on load errors so nothing ever shows broken. */
export function SmartImage({ srcs, alt, loading = "lazy", ...rest }: SmartImageProps) {
  const list = [...srcs.filter(Boolean), FALLBACK_IMAGE];
  const key = list.join("|");
  const [index, setIndex] = useState(0);

  useEffect(() => setIndex(0), [key]);

  return (
    <img
      {...rest}
      src={list[Math.min(index, list.length - 1)]}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setIndex((i) => (i < list.length - 1 ? i + 1 : i))}
    />
  );
}
