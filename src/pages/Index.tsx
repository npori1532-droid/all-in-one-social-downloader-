import * as React from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { DeveloperBadge } from "@/components/branding/DeveloperBadge";
import { Button } from "@/components/ui/button";
import { DownloaderSection } from "@/components/downloader/DownloaderSection";
import { SupportedPlatforms } from "@/components/sections/SupportedPlatforms";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { AboutDeveloper } from "@/components/sections/AboutDeveloper";
import { FAQSection } from "@/components/sections/FAQSection";
import { ArrowDown, Shield } from "lucide-react";

const Index = () => {
  const heroRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    document.title = "All-in-One Social Downloader | Developer Tech Master";

    const desc =
      "Fast, safe, and easy downloads from popular platforms. Paste a link and choose video/audio quality.";
    const meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (meta) meta.content = desc;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section
          ref={heroRef as any}
          className="bg-hero"
          onMouseMove={(e) => {
            const el = heroRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            el.style.setProperty("--spot-x", `${x}%`);
            el.style.setProperty("--spot-y", `${y}%`);
          }}
        >
          <div className="container py-14 md:py-20">
            <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <header className="space-y-6">
                <DeveloperBadge />
                <div className="space-y-3">
                  <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                    All-in-One Social Downloader
                  </h1>
                  <p className="max-w-xl text-base text-muted-foreground md:text-lg">
                    Fast, safe, and easy downloads from popular platforms.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="hero"
                    onClick={() => document.getElementById("downloader")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <ArrowDown />
                    Start downloading
                  </Button>
                  <Button variant="glass" asChild>
                    <a href="#developer">
                      <Shield /> About Developer
                    </a>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Tip: Always download only content you have the right to use.
                </p>
              </header>

              <div className="space-y-6">
                <DownloaderSection />
              </div>
            </div>
          </div>
        </section>

        <section className="container space-y-14 py-12 md:py-16">
          <SupportedPlatforms />
          <HowItWorks />
          <AboutDeveloper />
          <FAQSection />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Index;
