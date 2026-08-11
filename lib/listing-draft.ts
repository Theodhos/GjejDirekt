/**
 * Local draft for the listing wizard. Leaving the flow — most often through the
 * "Get Verified" call to action — must never cost the owner what they already typed.
 */

const PREFIX = "tripshqip:listing-draft:";
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

type StoredDraft = Record<string, unknown> & { savedAt: number };

function storage() {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    // Storage can be blocked (private mode / cookie settings).
    return null;
  }
}

export function readDraft<T extends Record<string, unknown>>(key: string): T | null {
  const store = storage();
  if (!store) return null;
  try {
    const raw = store.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredDraft;
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.savedAt || Date.now() - parsed.savedAt > MAX_AGE) {
      store.removeItem(PREFIX + key);
      return null;
    }
    return parsed as unknown as T;
  } catch {
    return null;
  }
}

export function writeDraft(key: string, value: Record<string, unknown>) {
  const store = storage();
  if (!store) return;
  const payload: StoredDraft = { ...value, savedAt: Date.now() };
  try {
    store.setItem(PREFIX + key, JSON.stringify(payload));
  } catch {
    // Over quota — the inlined cover photo is the only heavy field, so drop it and
    // keep everything the owner typed.
    try {
      const { coverDataUrl, ...rest } = payload;
      store.setItem(PREFIX + key, JSON.stringify(rest));
    } catch {
      // Nothing else to try; the draft simply is not saved.
    }
  }
}

export function clearDraft(key: string) {
  const store = storage();
  if (!store) return;
  try {
    store.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}
