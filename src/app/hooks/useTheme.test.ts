import { beforeEach, describe, expect, it } from 'vitest';
import { loadTheme, nextTheme } from './useTheme';

function installFakeLocalStorage(initial: Record<string, string> = {}) {
  const store = { ...initial };
  (globalThis as { localStorage?: unknown }).localStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
  };
}

describe('nextTheme', () => {
  it('버튼을 누를 때마다 system → light → dark → system 순으로 돈다', () => {
    expect(nextTheme('system')).toBe('light');
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('system');
  });
});

describe('loadTheme', () => {
  beforeEach(() => installFakeLocalStorage());

  it('저장된 값이 없으면 OS를 따르는 system', () => {
    expect(loadTheme()).toBe('system');
  });

  it('저장된 테마를 그대로 돌려준다', () => {
    installFakeLocalStorage({ theme: 'dark' });
    expect(loadTheme()).toBe('dark');
  });

  it('알 수 없는 값이 저장돼 있으면 system으로 되돌린다', () => {
    installFakeLocalStorage({ theme: 'sepia' });
    expect(loadTheme()).toBe('system');
  });
});
