import { DeveloperBadge } from "@/components/branding/DeveloperBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Youtube, Facebook } from "lucide-react";

export function AboutDeveloper() {
  return (
    <section id="developer" className="scroll-mt-24 space-y-4">
      <header className="space-y-2">
        <DeveloperBadge />
        <h2 className="font-display text-xl font-semibold">About Developer</h2>
        <p className="text-sm text-muted-foreground">
          Professional web developer focused on fast and user-friendly tools.
        </p>
      </header>

      <Card className="shadow-elev">
        <CardContent className="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              I build modern web apps with a focus on performance, clean UI, and practical UX. This downloader is
              designed to be simple, responsive, and safe-by-default.
            </p>
            <ul className="grid gap-2 text-sm">
              <li className="flex items-center justify-between rounded-lg border bg-background/60 px-3 py-2">
                <span className="text-muted-foreground">Specialty</span>
                <span className="font-medium">React + UX tooling</span>
              </li>
              <li className="flex items-center justify-between rounded-lg border bg-background/60 px-3 py-2">
                <span className="text-muted-foreground">Focus</span>
                <span className="font-medium">Speed & clarity</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Contact (placeholders)</p>
            <div className="grid gap-2">
              <Button variant="glass" className="justify-start" asChild>
                <a href="#" aria-label="Email (placeholder)">
                  <Mail /> Email
                </a>
              </Button>
              <Button variant="glass" className="justify-start" asChild>
                <a href="#" aria-label="WhatsApp (placeholder)">
                  <Phone /> WhatsApp
                </a>
              </Button>
              <Button variant="glass" className="justify-start" asChild>
                <a href="#" aria-label="Facebook (placeholder)">
                  <Facebook /> Facebook
                </a>
              </Button>
              <Button variant="glass" className="justify-start" asChild>
                <a href="#" aria-label="YouTube (placeholder)">
                  <Youtube /> YouTube
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
