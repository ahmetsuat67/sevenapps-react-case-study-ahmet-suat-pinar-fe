import { useCallback } from "react";
import Dexie from "dexie";

const db = new Dexie("MarkdownPlayground");
db.version(1).stores({
  settings: "&key, value",
  documents: "id, content",
});

export default function useIndexedDB<T = unknown>(tableName: string) {
  // item kaydetmek için
  const setItem = useCallback(
    async (key: string, value: T) => {
      try {
        await db.table(tableName).put({ key, value });
      } catch (err) {
        console.error(err);
      }
    },
    [tableName]
  );

  const getItem = useCallback(
    async (key: string): Promise<T | null> => {
      try {
        const item = await db.table(tableName).get(key);
        return item?.value ?? null;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    [tableName]
  );

  return { setItem, getItem };
}
