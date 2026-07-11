import { createDefaultState } from './defaults';
import type { AppState } from './types';

export const STATE_KEY = 'state';
const ERROR_KEY = 'lastCompileError';

export async function loadState(): Promise<AppState> {
  const result = await chrome.storage.local.get(STATE_KEY);
  const state = result[STATE_KEY] as AppState | undefined;
  if (state?.version !== 1) {
    const fresh = createDefaultState();
    await chrome.storage.local.set({ [STATE_KEY]: fresh });
    return fresh;
  }
  return state;
}

export async function saveState(state: AppState): Promise<void> {
  await chrome.storage.local.set({ [STATE_KEY]: state });
}

export async function loadCompileError(): Promise<string | null> {
  const result = await chrome.storage.local.get(ERROR_KEY);
  return (result[ERROR_KEY] as string | undefined) ?? null;
}

export async function saveCompileError(error: string | null): Promise<void> {
  await chrome.storage.local.set({ [ERROR_KEY]: error });
}

export function onCompileErrorChanged(
  cb: (error: string | null) => void,
): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && ERROR_KEY in changes) {
      cb((changes[ERROR_KEY].newValue as string | undefined) ?? null);
    }
  });
}
