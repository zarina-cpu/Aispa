export type HistoryItem = {
  id: string;
  createdAt: string;
  description: string;
  tone: string;
  length: string;
  hadImage: boolean;
  variants: string[];
};

export type HistoryResponse = {
  items: HistoryItem[];
  dbConfigured: boolean;
};

export async function fetchHistory(): Promise<HistoryResponse> {
  const res = await fetch("/api/history?limit=15");
  const data = (await res.json()) as HistoryResponse & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "Не удалось загрузить историю");
  }
  return data;
}
