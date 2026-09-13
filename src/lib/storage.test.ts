import { afterEach, describe, expect, it } from 'vitest';
import { clearDraft, loadDraft, saveDraft } from './storage';

afterEach(async () => clearDraft());

describe('local draft storage', () => {
  it('round-trips the single saved draft', async () => {
    await saveDraft({ source: 'flowchart LR\nA --> B', colorMode: 'dark' });
    await expect(loadDraft()).resolves.toEqual({ source: 'flowchart LR\nA --> B', colorMode: 'dark' });
  });

  it('clears the saved draft', async () => {
    await saveDraft({ source: 'graph TD\nA', colorMode: 'system' });
    await clearDraft();
    await expect(loadDraft()).resolves.toBeUndefined();
  });
});
