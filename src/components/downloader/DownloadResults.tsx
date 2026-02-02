import { DownloadResult } from "@/lib/downloader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Copy, Download, Music, Video } from "lucide-react";

function kindIcon(kind: "video" | "audio") {
  return kind === "audio" ? <Music /> : <Video />;
}

export function DownloadResults({ result }: { result: DownloadResult }) {
  return (
    <section className="space-y-4" aria-label="Download results">
      <Card className="shadow-elev">
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="font-display text-xl">Results</CardTitle>
            {result.platform ? <Badge variant="secondary">{result.platform}</Badge> : null}
          </div>

          {result.title ? <p className="text-sm text-muted-foreground">{result.title}</p> : null}
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-[220px_1fr]">
          <div className="overflow-hidden rounded-lg border bg-background">
            {result.thumbnail ? (
              <img
                src={result.thumbnail}
                alt={result.title ? `Thumbnail for ${result.title}` : "Thumbnail preview"}
                loading="lazy"
                className="aspect-video w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-muted">
                <p className="text-xs text-muted-foreground">No thumbnail</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {result.options.length ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {result.options.map((opt, idx) => (
                  <li key={`${opt.url}-${idx}`}>
                    <Card className="h-full border bg-card shadow-elev">
                      <CardContent className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{kindIcon(opt.kind)}</span>
                            <div>
                              <p className="font-medium leading-tight">{opt.label}</p>
                              {opt.size ? <p className="text-xs text-muted-foreground">{opt.size}</p> : null}
                            </div>
                          </div>
                          <Badge variant={opt.kind === "audio" ? "secondary" : "outline"}>
                            {opt.kind.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="hero"
                            className="flex-1"
                            onClick={() => window.open(opt.url, "_blank", "noopener,noreferrer")}
                          >
                            <Download />
                            Download
                          </Button>
                          <Button
                            variant="glass"
                            size="icon"
                            aria-label="Copy download link"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(opt.url);
                                toast.success("Download link copied");
                              } catch {
                                toast.error("Could not copy link");
                              }
                            }}
                          >
                            <Copy />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">
                  No download options were returned for this link. Try another URL or a different post/video.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
