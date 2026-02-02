import * as React from "react";

export type RecentDownloadItem = {
  url: string;
  platform?: string;
  title?: string;
  at: number;
};

const STORAGE_KEY = "dtm_recent_downloads_v1";

export function useRecentDownloads(limit = 6) {
  const [items, setItems] = React.useState<RecentDownloadItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as RecentDownloadItem[]).slice(0, limit) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, limit)));
    } catch {
      // ignore storage issues
    }
  }, [items, limit]);

  const add = React.useCallback(
    (item: Omit<RecentDownloadItem, "at">) => {
      setItems((prev) => {
        const next: RecentDownloadItem[] = [
          { ...item, at: Date.now() },
          ...prev.filter((p) => p.url !== item.url),
        ];
        return next.slice(0, limit);
      });
    },
    [limit],
  );

  const clear = React.useCallback(() => setItems([]), []);

  return { items, add, clear };
}
