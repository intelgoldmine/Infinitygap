import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "w-7 h-7",
  md: "w-9 h-9",
  lg: "w-11 h-11",
} as const;

type Size = keyof typeof sizeMap;

/** Brand logo mark using the generated logo image. Use `onDark` on navy / dark marketing surfaces. */
export function BrandHexMark({
  size = "md",
  className,
  variant = "default",
}: {
  size?: Size;
  className?: string;
  variant?: "default" | "onDark";
}) {
  return (
    <img
      src={variant === "onDark" ? "/logo-white.png" : "/logo.png"}
      alt="Intel GoldMine"
      className={cn("shrink-0 object-contain", sizeMap[size], className)}
    />
  );
}
