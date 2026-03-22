import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Slightly larger hit target on marketing header */
  size?: "default" | "sm";
};

export function ThemeToggle({ className, size = "default" }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "shrink-0 rounded-full border border-border/40 bg-muted/20",
          size === "sm" ? "h-9 w-9" : "h-10 w-10",
          className,
        )}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        "touch-manipulation rounded-full border-border/60 bg-background/80 shadow-sm shrink-0 text-muted-foreground hover:bg-muted/70 hover:text-foreground",
        size === "sm" ? "h-9 w-9 min-h-9 min-w-9" : "h-10 w-10 min-h-10 min-w-10",
        className,
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </Button>
  );
}
