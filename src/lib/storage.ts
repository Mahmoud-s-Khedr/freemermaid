import { openDB } from 'idb';
import type { DBSchema } from 'idb';
import type { SavedDraft } from './types';

const DATABASE_NAME = 'freemermaid';
const STORE_NAME = 'app-state';
const DRAFT_KEY = 'draft';

interface FreeMermaidDatabase extends DBSchema {
  'app-state': {
    key: string;
    value: SavedDraft;
  };
}

async function getDatabase() {
  return openDB<FreeMermaidDatabase>(DATABASE_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    }
  });
}

export async function loadDraft(): Promise<SavedDraft | undefined> {
  return (await getDatabase()).get(STORE_NAME, DRAFT_KEY);
}

export async function saveDraft(draft: SavedDraft): Promise<void> {
  await (await getDatabase()).put(STORE_NAME, draft, DRAFT_KEY);
}

export async function clearDraft(): Promise<void> {
  await (await getDatabase()).delete(STORE_NAME, DRAFT_KEY);
}
