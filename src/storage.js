import { isSnapshot } from './model.js';

export const STORAGE_KEY = 'hackathon-copilot:v1';

export function createStorage(getStorage = () => globalThis.localStorage) {
  let blocked = false;
  return {
    load() {
      let raw;
      try { raw = getStorage().getItem(STORAGE_KEY); }
      catch { return { status: 'unavailable', data: null }; }
      if (raw === null) return { status: 'empty', data: null };
      try {
        const data = JSON.parse(raw);
        if (!isSnapshot(data)) throw new Error('Invalid saved data');
        return { status: 'ok', data };
      } catch {
        blocked = true;
        return { status: 'invalid', data: null };
      }
    },
    save(data) {
      if (blocked) return { status: 'invalid' };
      if (!isSnapshot(data)) return { status: 'invalid-data' };
      try { getStorage().setItem(STORAGE_KEY, JSON.stringify(data)); return { status: 'ok' }; }
      catch { return { status: 'unavailable' }; }
    }
  };
}
