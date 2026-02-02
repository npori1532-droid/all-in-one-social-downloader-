import { DeveloperBadge } from "@/components/branding/DeveloperBadge";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container grid gap-6 py-10 md:grid-cols-2 md:items-center">
        <div className="space-y-2">
          <DeveloperBadge />
          <p className="text-sm text-muted-foreground">
            Disclaimer: This tool is for personal use. Respect platform policies and copyrights.
          </p>
        </div>
        <div className="text-sm text-muted-foreground md:text-right">
          <p className="font-display text-foreground">Developer Tech Master</p>
          <p>Modern, safe, and user-friendly download utilities.</p>
        </div>
      </div>
    </footer>
  );
}
