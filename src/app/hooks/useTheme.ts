import { useState } from 'react';

export type Theme = 'system' | 'light' | 'dark';

const THEME_KEY = 'theme';
const ORDER: Theme[] = ['system', 'light', 'dark'];

export function nextTheme(theme: Theme): Theme {
  return ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
}

// 팝업과 옵션 페이지가 같은 origin이라 localStorage로 공유된다.
// chrome.storage와 달리 동기로 읽혀서 첫 렌더 전에 적용할 수 있다
export function loadTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY);
  return ORDER.find((t) => t === saved) ?? 'system';
}

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

export function applySavedTheme(): void {
  applyTheme(loadTheme());
}

export function useTheme() {
  const [theme, setTheme] = useState(loadTheme);

  const cycleTheme = () => {
    const next = nextTheme(theme);
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    setTheme(next);
  };

  return { theme, cycleTheme };
}
