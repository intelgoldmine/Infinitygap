import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PanelLeftClose, PanelLeft, LogOut, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { GeoSelector } from "@/components/intel/GeoSelector";
import { useGeoContext } from "@/contexts/GeoContext";
import { useAuth } from "@/contexts/AuthContext";
import { BrandHexMark } from "@/components/BrandHexMark";
import { BrandWordmark } from "@/components/BrandWordmark";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { APP_NAV_ITEMS, appNavIconClass, appNavLinkClass, isAppNavActive } from "@/components/layout/appNavConfig";
import { cn } from "@/lib/utils";

export function TopBar({ sidebarOpen, toggleSidebar }: { sidebarOpen: boolean; toggleSidebar: () => void }) {
  const { isGlobal, geoString } = useGeoContext();
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-50 min-h-[60px] h-[60px] border-b border-border/40 bg-card/70 backdrop-blur-2xl flex items-center px-2.5 sm:px-5 gap-1.5 sm:gap-3 shrink-0"
    >
      <button
        type="button"
        onClick={toggleSidebar}
        className="shrink-0 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
        title="Industries"
        aria-label={sidebarOpen ? "Close industries sidebar" : "Open industries sidebar"}
      >
        {sidebarOpen ? <PanelLeftClose className="w-[18px] h-[18px]" /> : <PanelLeft className="w-[18px] h-[18px]" />}
      </button>

      <Link
        to="/dashboard"
        className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2.5"
      >
        <BrandHexMark size="md" className="shrink-0" />
        <span className="min-w-0 shrink-0">
          <BrandWordmark compact className="!text-sm leading-tight sm:!text-base sm:leading-none" />
        </span>
      </Link>

      <div className="min-w-0 flex-1 md:hidden" aria-hidden />

      <nav
        className="hidden min-w-0 flex-1 items-center justify-center gap-1 px-1 md:flex lg:gap-1.5 lg:px-2"
        aria-label="Main navigation"
      >
        {APP_NAV_ITEMS.map((item) => {
          const active = isAppNavActive(location.pathname, item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(appNavLinkClass(active, "header"), "shrink-0")}
            >
              <item.icon className={appNavIconClass(active)} />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="shrink-0 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-[18px] h-[18px]" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[min(100%,20rem)] border-border/60 bg-card/95 px-5 pt-10 backdrop-blur-xl">
          <SheetHeader className="text-left">
            <SheetTitle className="font-display text-lg">Navigate</SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-1.5" aria-label="Main navigation">
            {APP_NAV_ITEMS.map((item) => {
              const active = isAppNavActive(location.pathname, item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(appNavLinkClass(active, "sidebar"))}
                >
                  <item.icon className={appNavIconClass(active)} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <span className="hidden text-xs font-medium text-muted-foreground lg:inline shrink-0">
        {isGlobal ? "Global" : geoString}
      </span>

      <div className="ml-auto flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-3">
        <ThemeToggle size="sm" />
        {profile?.display_name && (
          <span className="text-sm text-muted-foreground hidden sm:block truncate max-w-[160px] font-semibold">
            {profile.display_name}
          </span>
        )}
        <GeoSelector />
        <button
          onClick={signOut}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
          title="Sign out"
        >
          <LogOut className="w-[18px] h-[18px]" />
        </button>
      </div>
    </motion.header>
  );
}
