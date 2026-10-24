import type { ReactNode } from 'react';
import { type Theme, useTheme } from '../hooks/useTheme';

// 텍스트 글리프는 기호마다 다른 폰트로 대체돼 굵기가 어긋나서 같은 그리드의 SVG로 그린다
const ICONS: Record<Theme, ReactNode> = {
  system: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  dark: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
};

const NAMES: Record<Theme, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
};

export function ThemeButton() {
  const { theme, cycleTheme } = useTheme();
  const label = `Theme: ${NAMES[theme]}`;

  return (
    <button
      type="button"
      className="theme-btn"
      title={label}
      aria-label={label}
      onClick={cycleTheme}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {ICONS[theme]}
      </svg>
    </button>
  );
}
