import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MediaDB extends DBSchema {
  mediaFiles: {
    key: string;
    value: File;
  };
}

let dbPromise: Promise<IDBPDatabase<MediaDB>>;

const getDb = () => {
  if (!dbPromise) {
    dbPromise = openDB<MediaDB>('media-files-db', 1, {
      upgrade(db) {
        db.createObjectStore('mediaFiles');
      },
    });
  }
  return dbPromise;
};

export const addMediaFile = async (id: string, file: File): Promise<void> => {
  const db = await getDb();
  await db.put('mediaFiles', file, id);
};

export const getMediaFile = async (id: string): Promise<File | undefined> => {
  const db = await getDb();
  return db.get('mediaFiles', id);
};

export const deleteMediaFile = async (id: string): Promise<void> => {
  const db = await getDb();
  await db.delete('mediaFiles', id);
};
