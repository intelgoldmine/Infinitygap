import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  className?: string;
  compact?: boolean;
  /** Use on dark headers/footers so “Intel” reads on navy. */
  variant?: "default" | "onDark";
};

export function BrandWordmark({ className, compact, variant = "default" }: BrandWordmarkProps) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline select-none leading-none gap-1.5 font-sans",
        compact ? "text-sm" : "text-base sm:text-lg",
        className,
      )}
    >
      <span
        className={cn(
          "font-bold tracking-tight",
          variant === "onDark" ? "text-white" : "text-foreground",
        )}
      >
        Intel
      </span>
      <span className="text-gradient-gold font-bold tracking-tight" style={{
        backgroundImage: "linear-gradient(135deg, hsl(38 92% 50%), hsl(32 85% 38%))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>GoldMine</span>
    </span>
  );
}
