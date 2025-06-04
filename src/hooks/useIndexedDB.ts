import { useCallback } from "react";
import Dexie from "dexie";

interface SettingsStore {
  key: string;
  value: unknown;
}

interface DocumentStore {
  id: string;
  content: unknown;
}

const db = new Dexie("MarkdownPlayground");
db.version(1).stores({
  settings: "&key, value",
  documents: "&id, content",
});

export default function useIndexedDB<T = unknown>(tableName: string) {
  const setItem = useCallback(
    async (id: string, content: T) => {
      try {
        const data =
          tableName === "settings"
            ? ({ key: id, value: content } as SettingsStore)
            : ({ id, content } as DocumentStore);

        await db.table(tableName).put(data);
      } catch (err) {
        console.error(`Failed to save to IndexedDB: ${err}`);
        throw err;
      }
    },
    [tableName]
  );

  const getItem = useCallback(
    async (id: string): Promise<T | null> => {
      try {
        const item = await db.table(tableName).get(id);
        return (tableName === "settings" ? item?.value : item?.content) ?? null;
      } catch (err) {
        console.error(`Failed to read from IndexedDB: ${err}`);
        return null;
      }
    },
    [tableName]
  );

  return { setItem, getItem };
}
