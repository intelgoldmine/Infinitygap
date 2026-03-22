import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "w-7 h-7",
  md: "w-9 h-9",
  lg: "w-11 h-11",
} as const;

type Size = keyof typeof sizeMap;

/** Brand mark — canonical asset is `/logo-white.png` site-wide (light + dark surfaces). */
export function BrandHexMark({
  size = "md",
  className,
  variant = "default",
}: {
  size?: Size;
  className?: string;
  /** Reserved for future contrast tweaks; both variants use the same asset. */
  variant?: "default" | "onDark";
}) {
  return (
    <img
      src="/logo-white.png"
      alt="Intel GoldMine"
      className={cn(
        "shrink-0 object-contain",
        variant === "default" && "drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
        sizeMap[size],
        className,
      )}
    />
  );
}
