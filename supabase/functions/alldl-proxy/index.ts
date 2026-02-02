// Lovable Cloud function: server-side proxy for the third-party downloader API.
// - Keeps third-party endpoint out of client code
// - Adds server-side validation and basic rate limiting

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type Json = Record<string, unknown>;

function jsonResponse(status: number, body: Json) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function safeClientIp(req: Request): string {
  // Best-effort; may be absent depending on runtime.
  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim();
  return ip || "unknown";
}

function validateUrl(input: unknown): { ok: true; url: string } | { ok: false; message: string } {
  if (typeof input !== "string") return { ok: false, message: "Missing url" };

  const trimmed = input.trim();
  if (trimmed.length < 8) return { ok: false, message: "Invalid url" };
  if (trimmed.length > 2048) return { ok: false, message: "URL is too long" };

  try {
    const u = new URL(trimmed);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return { ok: false, message: "Only http/https URLs are supported" };
    }
    return { ok: true, url: u.toString() };
  } catch {
    return { ok: false, message: "Invalid url" };
  }
}

// Basic per-IP rate limit (best-effort, in-memory per runtime instance)
const bucket = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const list = bucket.get(key) ?? [];
  const recent = list.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    bucket.set(key, recent);
    return false;
  }
  recent.push(now);
  bucket.set(key, recent);
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const ip = safeClientIp(req);
  if (!checkRateLimit(ip)) {
    return jsonResponse(429, { error: "Too many requests" });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body" });
  }

  const validated = validateUrl(body?.url);
  if (!validated.ok) {
    return jsonResponse(400, { error: validated.message });
  }

  const endpoint = `https://free-goat-api.onrender.com/alldl?url=${encodeURIComponent(validated.url)}`;

  // Add a hard timeout so requests can't hang.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const upstream = await fetch(endpoint, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    const text = await upstream.text();
    let data: unknown = text;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // keep as text
    }

    if (!upstream.ok) {
      return jsonResponse(upstream.status, {
        error: "Upstream API error",
        status: upstream.status,
      });
    }

    return jsonResponse(200, data && typeof data === "object" ? (data as Json) : { data });
  } catch (e) {
    const name = (e as any)?.name;
    if (name === "AbortError") {
      return jsonResponse(504, { error: "Upstream timeout" });
    }
    return jsonResponse(502, { error: "Failed to reach upstream" });
  } finally {
    clearTimeout(timeout);
  }
});
