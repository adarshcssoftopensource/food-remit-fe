/**
 * Safe, SSR-resilient storage wrapper.
 * Prevents hydration errors and handles Private/Incognito mode storage blocks gracefully.
 */
class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

const memoryFallback = new MemoryStorage();

function getStorage(type: "local" | "session"): Storage | MemoryStorage {
  if (typeof window === "undefined") {
    return memoryFallback;
  }
  try {
    const storage = type === "local" ? window.localStorage : window.sessionStorage;
    const testKey = "__storage_test__";
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return storage;
  } catch {
    return memoryFallback;
  }
}

export const safeStorage = {
  local: {
    get: <T = unknown>(key: string, fallback: T | null = null): T | null => {
      try {
        const item = getStorage("local").getItem(key);
        return item ? (JSON.parse(item) as T) : fallback;
      } catch {
        return fallback;
      }
    },
    set: <T = unknown>(key: string, value: T): void => {
      try {
        getStorage("local").setItem(key, JSON.stringify(value));
      } catch {
        // Silently fail if storage is full or restricted
      }
    },
    remove: (key: string): void => {
      getStorage("local").removeItem(key);
    },
  },

  session: {
    get: <T = unknown>(key: string, fallback: T | null = null): T | null => {
      try {
        const item = getStorage("session").getItem(key);
        return item ? (JSON.parse(item) as T) : fallback;
      } catch {
        return fallback;
      }
    },
    set: <T = unknown>(key: string, value: T): void => {
      try {
        getStorage("session").setItem(key, JSON.stringify(value));
      } catch {
        // Silently fail
      }
    },
    remove: (key: string): void => {
      getStorage("session").removeItem(key);
    },
  },
};
