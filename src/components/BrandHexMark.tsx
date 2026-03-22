import { useTheme } from "next-themes";
import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

const sizeMap = {
  /** Compact rails (TopBar, legal shell) — readable at a glance */
  sm: "w-9 h-9 sm:w-10 sm:h-10",
  /** Marketing footer / dark surfaces — large lockup */
  footer:
    "w-[5.5rem] h-[5.5rem] sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36",
  md: "w-11 h-11 sm:w-12 sm:h-12",
  lg: "w-14 h-14 sm:w-[3.75rem] sm:h-[3.75rem]",
  /** Marketing / dashboard hero emphasis */
  xl: "w-[3.75rem] h-[3.75rem] sm:w-16 sm:h-16 md:w-[4.25rem] md:h-[4.25rem] lg:w-[4.5rem] lg:h-[4.5rem]",
  /**
   * Marketing + auth headers — tune with `--brand-header-mark-size` on the mark.
   */
  header:
    "w-[clamp(3.75rem,var(--brand-header-mark-size,5.75rem),8rem)] h-[clamp(3.75rem,var(--brand-header-mark-size,5.75rem),8rem)]",
  /** Landing hero */
  hero: "w-[6.25rem] h-[6.25rem] sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-[9.5rem] xl:h-[9.5rem]",
  /** Auth / reset spotlight */
  "2xl":
    "w-[8rem] h-[8rem] sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-[13.5rem] lg:h-[13.5rem] xl:w-[15.5rem] xl:h-[15.5rem]",
} as const;

type Size = keyof typeof sizeMap;

/** Logos: `/logo-light.png` (light UI) · `/logo-dark.png` (dark UI / dark surfaces). */
export function BrandHexMark({
  size = "md",
  className,
  variant = "default",
  /** When `size="header"`, sets `--brand-header-mark-size` on the mark (e.g. `"6rem"`). Bar height stays fixed. */
  headerMarkSize,
}: {
  size?: Size;
  className?: string;
  /** Logo for dark backgrounds (e.g. marketing footer) — always uses the dark-surface asset. */
  variant?: "default" | "onDark";
  headerMarkSize?: string;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const useDarkAsset = variant === "onDark" || (mounted && resolvedTheme === "dark");
  const src = useDarkAsset ? "/logo-dark.png" : "/logo-light.png";

  const headerVarStyle =
    size === "header" && headerMarkSize
      ? ({ ["--brand-header-mark-size" as string]: headerMarkSize } as CSSProperties)
      : undefined;

  return (
    <img
      src={src}
      alt="Intel GoldMine"
      style={headerVarStyle}
      className={cn(
        "shrink-0 object-contain",
        variant === "default" && !useDarkAsset && "drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
        sizeMap[size],
        className,
      )}
    />
  );
}
