"use client";

import Image from "next/image";
import { useTheme } from "@/components/ThemeProvider";

/** Light UI → `lightlogo.png`; dark UI → `darklogo.png` (see `/public`). */
export function maxtronizeLogoPath(theme: "light" | "dark"): string {
  return theme === "dark" ? "/lightlogo.png" : "/darklogo.png";
}

type MaxtronizeLogoProps = {
  alt?: string;
  className?: string;
  priority?: boolean;
} & (
  | { fill: true; sizes: string; width?: never; height?: never }
  | { fill?: false; width: number; height: number; sizes?: string }
);

export function MaxtronizeLogo({
  alt = "Maxtronize Logo",
  className,
  priority,
  ...props
}: MaxtronizeLogoProps) {
  const { theme } = useTheme();
  const src = maxtronizeLogoPath(theme);

  if ("fill" in props && props.fill) {
    const { sizes } = props;
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        priority={priority}
      />
    );
  }

  const { width, height, sizes } = props as {
    width: number;
    height: number;
    sizes?: string;
  };

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
