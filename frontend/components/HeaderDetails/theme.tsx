'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const t = useTranslations('Nav.Theme');
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <Button
      title={t('toggle_theme')}
      variant="tertiary"
      size="icon"
      className="group"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <MoonIcon
        data-state={resolvedTheme === 'light' ? 'dark' : 'light'}
        className="text-dim animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 size-4 group-hover:text-black data-[state=dark]:flex data-[state=light]:hidden"
      />
      <SunIcon
        data-state={resolvedTheme === 'light' ? 'dark' : 'light'}
        className="text-dim animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 -m-0.5 size-5 group-hover:text-[#FFFFFF] data-[state=light]:flex data-[state=dark]:hidden"
      />
      <div className="sr-only">
        {theme === 'light' ? t('toggle_dark') : t('toggle_light')}
      </div>
    </Button>
  );
}

function MoonIcon({ ...props }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17 12.522C16.1125 12.8919 15.1603 13.0817 14.1988 13.0804C10.1784 13.0804 6.91958 9.82157 6.91958 5.80119C6.91958 4.80823 7.11817 3.86231 7.47803 3C6.15169 3.5533 5.01875 4.48672 4.22188 5.68268C3.42502 6.87864 2.99988 8.28366 3 9.72078C3 13.7411 6.25885 17 10.2792 17C11.7163 17.0001 13.1214 16.575 14.3173 15.7781C15.5133 14.9813 16.4467 13.8483 17 12.522Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon({ ...props }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip_sun)">
        <path
          d="M10 0.75V2.25M16.25 3.75L15.0659 4.93416M19.25 10.0001H17.75M17.25 16.2501L16.0659 15.066M10 17.75V19.25M4.93411 15.0659L3.74997 16.25M2.25 10.0001H0.75M4.93405 4.93423L3.74991 3.75003M15 10C15 12.7614 12.7614 15 10 15C7.23858 15 5 12.7614 5 10C5 7.23858 7.23858 5 10 5C12.7614 5 15 7.23858 15 10Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip_sun">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
