export type MediaKind = "video" | "audio";

export type DownloadOption = {
  kind: MediaKind;
  label: string;
  url: string;
  size?: string;
};

export type DownloadResult = {
  platform?: string;
  title?: string;
  thumbnail?: string;
  options: DownloadOption[];
  raw?: unknown;
};

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function ensureHttpUrl(v: unknown): string | undefined {
  const s = asString(v);
  if (!s) return;
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return;
    return u.toString();
  } catch {
    return;
  }
}

function detectKind(maybe: unknown): MediaKind {
  const s = typeof maybe === "string" ? maybe.toLowerCase() : "";
  if (s.includes("audio") || s.includes("mp3") || s.includes("m4a")) return "audio";
  return "video";
}

function normalizeOptions(mediasUnknown: unknown): DownloadOption[] {
  const options: DownloadOption[] = [];

  const pushOption = (m: any) => {
    const url = ensureHttpUrl(m?.url ?? m?.link ?? m?.download_url ?? m?.downloadUrl);
    if (!url) return;

    const label =
      asString(m?.quality ?? m?.resolution ?? m?.label ?? m?.name) ??
      (typeof m?.format === "string" ? m.format : undefined) ??
      "Download";

    const size = asString(m?.size ?? m?.filesize ?? m?.formattedSize);

    const kind = detectKind(m?.type ?? m?.kind ?? label);
    options.push({ kind, label, url, size });
  };

  if (Array.isArray(mediasUnknown)) {
    for (const m of mediasUnknown) pushOption(m);
  } else if (mediasUnknown && typeof mediasUnknown === "object") {
    // Sometimes links are grouped by keys (e.g. { video: [...], audio: [...] })
    for (const [, value] of Object.entries(mediasUnknown as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        for (const m of value) pushOption(m);
      } else {
        pushOption(value);
      }
    }
  }

  // de-dupe by URL
  const seen = new Set<string>();
  return options.filter((o) => {
    if (seen.has(o.url)) return false;
    seen.add(o.url);
    return true;
  });
}

export function detectPlatformFromUrl(inputUrl: string): string | undefined {
  try {
    const host = new URL(inputUrl).hostname.toLowerCase();
    const map: Array<[RegExp, string]> = [
      [/youtube\.com$|youtu\.be$/, "YouTube"],
      [/facebook\.com$|fb\.watch$/, "Facebook"],
      [/instagram\.com$/, "Instagram"],
      [/tiktok\.com$/, "TikTok"],
      [/twitter\.com$|x\.com$/, "Twitter/X"],
      [/snapchat\.com$/, "Snapchat"],
      [/pinterest\.com$|pin\.it$/, "Pinterest"],
      [/likee\.video$|likee\.com$/, "Likee"],
    ];
    return map.find(([re]) => re.test(host))?.[1];
  } catch {
    return;
  }
}

export function parseAllDlResponse(json: any, fallbackUrl?: string): DownloadResult {
  const candidate = json?.data ?? json?.result ?? json;

  const platform = asString(candidate?.platform ?? candidate?.source ?? candidate?.site ?? candidate?.website);
  const title = asString(candidate?.title ?? candidate?.caption ?? candidate?.desc ?? candidate?.description);
  const thumbnail = ensureHttpUrl(candidate?.thumbnail ?? candidate?.thumb ?? candidate?.image ?? candidate?.cover);

  const options = normalizeOptions(
    candidate?.medias ??
      candidate?.media ??
      candidate?.links ??
      candidate?.urls ??
      candidate?.download ??
      candidate?.downloads,
  );

  return {
    platform: platform ?? (fallbackUrl ? detectPlatformFromUrl(fallbackUrl) : undefined),
    title,
    thumbnail,
    options,
    raw: json,
  };
}
