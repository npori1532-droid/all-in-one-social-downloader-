import { DeveloperBadge } from "@/components/branding/DeveloperBadge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <DeveloperBadge />
          <div className="hidden md:block">
            <p className="font-display text-sm font-semibold">All-in-One Social Downloader</p>
            <p className="text-xs text-muted-foreground">Video & Audio</p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <Button asChild variant="ghost" className="h-9 px-3">
            <a href="#downloader">Downloader</a>
          </Button>
          <Button asChild variant="ghost" className="h-9 px-3">
            <a href="#how">How it works</a>
          </Button>
          <Button asChild variant="ghost" className="h-9 px-3">
            <a href="#developer">About Developer</a>
          </Button>
          <Button asChild variant="ghost" className="h-9 px-3">
            <a href="#faq">FAQ</a>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
