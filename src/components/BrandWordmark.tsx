import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  className?: string;
  /** Slightly smaller when space is tight (e.g. sidebar). */
  compact?: boolean;
};

/**
 * Platform name: Intel GoldMine — tech display font.
 * The AI agent is Maverick (see copy / badges elsewhere).
 */
export function BrandWordmark({ className, compact }: BrandWordmarkProps) {
  return (
    <span
      className={cn(
        "font-brand inline-flex items-baseline select-none leading-none gap-1",
        compact ? "text-sm" : "text-base sm:text-lg",
        className,
      )}
    >
      <span className="text-foreground font-bold tracking-tight">Intel</span>
      <span className="text-gradient-primary font-bold tracking-tight">GoldMine</span>
    </span>
  );
}
