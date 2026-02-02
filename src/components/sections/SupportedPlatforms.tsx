import { Card, CardContent } from "@/components/ui/card";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Music2,
  Video,
  Sparkles,
  Ghost,
  Pin,
  CircleDashed,
} from "lucide-react";

const PLATFORMS = [
  { name: "YouTube", Icon: Youtube },
  { name: "Facebook", Icon: Facebook },
  { name: "Instagram", Icon: Instagram },
  { name: "TikTok", Icon: Video },
  { name: "Twitter/X", Icon: Twitter },
  { name: "Snapchat", Icon: Ghost },
  { name: "Pinterest", Icon: Pin },
  { name: "Likee", Icon: Sparkles },
  { name: "Audio", Icon: Music2 },
  { name: "More", Icon: CircleDashed },
];

export function SupportedPlatforms() {
  return (
    <section aria-label="Supported platforms" className="space-y-4">
      <header className="space-y-1">
        <h2 className="font-display text-xl font-semibold">Supported platforms</h2>
        <p className="text-sm text-muted-foreground">Visual list—availability depends on the source link and API response.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {PLATFORMS.map(({ name, Icon }) => (
          <Card key={name} className="shadow-elev">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="grid size-9 place-items-center rounded-lg border bg-background">
                <Icon className="text-muted-foreground" />
              </span>
              <p className="text-sm font-medium">{name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
