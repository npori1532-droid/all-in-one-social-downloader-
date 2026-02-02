import * as React from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";
import { DownloadResults } from "@/components/downloader/DownloadResults";
import { detectPlatformFromUrl, parseAllDlResponse, type DownloadResult } from "@/lib/downloader";
import { useRecentDownloads } from "@/hooks/use-recent-downloads";
import { AlertTriangle, Eraser, Loader2, ShieldCheck } from "lucide-react";

const urlSchema = z
  .string()
  .trim()
  .min(8, "Please paste a valid URL")
  .max(2048, "URL is too long")
  .refine((v) => {
    try {
      const u = new URL(v);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }, "Please paste a valid http/https link");

export function DownloaderSection() {
  const [url, setUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<DownloadResult | null>(null);
  const recent = useRecentDownloads(6);

  const platform = React.useMemo(() => {
    const normalized = url.trim();
    if (!normalized) return undefined;
    return detectPlatformFromUrl(normalized);
  }, [url]);

  async function onDownload() {
    setError(null);
    setResult(null);

    const parsed = urlSchema.safeParse(url);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid link");
      return;
    }

    const cleanUrl = parsed.data;
    const endpoint = `https://free-goat-api.onrender.com/alldl?url=${encodeURIComponent(cleanUrl)}`;

    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`API error (${res.status})`);
      }

      const json = await res.json();
      const parsedResult = parseAllDlResponse(json, cleanUrl);

      if (!parsedResult.options.length) {
        toast.message("No download links found", {
          description: "The API responded, but did not return any downloadable media for this URL.",
        });
      } else {
        toast.success("Links ready", { description: "Choose your preferred quality and download." });
      }

      setResult(parsedResult);
      recent.add({ url: cleanUrl, platform: parsedResult.platform ?? platform, title: parsedResult.title });
    } catch (e: any) {
      const message = typeof e?.message === "string" ? e.message : "Something went wrong";
      setError(message);
      toast.error("Download failed", { description: message });
    } finally {
      setLoading(false);
    }
  }

  function onClear() {
    setUrl("");
    setError(null);
    setResult(null);
  }

  return (
    <section id="downloader" className="scroll-mt-24">
      <Card className="shadow-elev">
        <CardContent className="space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="font-display text-lg font-semibold">URL Downloader</p>
              <p className="text-sm text-muted-foreground">
                Paste a supported link, fetch available media, then choose quality.
              </p>
            </div>
            {platform ? <Badge variant="outline">Auto-detected: {platform}</Badge> : null}
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a YouTube / Instagram / TikTok / X link…"
              inputMode="url"
              aria-label="Social media URL"
            />
            <Button variant="hero" onClick={onDownload} disabled={loading} className="md:w-[160px]">
              {loading ? <Loader2 className="animate-spin" /> : null}
              {loading ? "Fetching" : "Download"}
            </Button>
            <Button variant="glass" onClick={onClear} disabled={loading && !url}>
              <Eraser />
              Clear
            </Button>
          </div>

          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Safety & copyright</AlertTitle>
            <AlertDescription>
              We validate links client-side before calling the API. This tool is for personal use—respect platform rules
              and copyrighted content.
            </AlertDescription>
          </Alert>

          {error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Couldn’t fetch download links</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {result ? <DownloadResults result={result} /> : null}

          {recent.items.length ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-sm font-semibold">Recent downloads (local)</p>
                <Button variant="ghost" className="h-8 px-2" onClick={recent.clear}>
                  Clear list
                </Button>
              </div>
              <ul className="grid gap-2 md:grid-cols-2">
                {recent.items.map((item) => (
                  <li key={item.at}>
                    <button
                      type="button"
                      className="w-full rounded-lg border bg-background/60 p-3 text-left shadow-elev transition-colors hover:bg-accent"
                      onClick={() => {
                        setUrl(item.url);
                        toast.message("Loaded recent URL", { description: item.platform ?? "" });
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{item.title ?? item.url}</p>
                          <p className="truncate text-xs text-muted-foreground">{item.url}</p>
                        </div>
                        {item.platform ? <Badge variant="secondary">{item.platform}</Badge> : null}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
