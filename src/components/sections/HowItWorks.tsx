import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, MousePointerClick, ListVideo } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Paste link",
    desc: "Copy a public post/video URL and paste it into the downloader.",
    Icon: Link2,
  },
  {
    step: "02",
    title: "Click download",
    desc: "We fetch available media links from the API securely.",
    Icon: MousePointerClick,
  },
  {
    step: "03",
    title: "Choose quality",
    desc: "Select HD/SD video or audio formats and download in a new tab.",
    Icon: ListVideo,
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 space-y-4">
      <header className="space-y-1">
        <h2 className="font-display text-xl font-semibold">How it works</h2>
        <p className="text-sm text-muted-foreground">Three simple steps—optimized for mobile.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {STEPS.map(({ step, title, desc, Icon }) => (
          <Card key={step} className="shadow-elev">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-lg border bg-background">
                  <Icon className="text-muted-foreground" />
                </span>
                <Badge variant="secondary">{step}</Badge>
              </div>
              <div>
                <p className="font-display text-base font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
