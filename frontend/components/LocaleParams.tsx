'use client';
import { usePathname } from 'next/navigation';

export default function LocaleParams() {
  const pathname = usePathname();
  const segments = pathname.split('/');

  // Define your supported locales
  const supportedLocales = ['ms', 'en'];
  let activeLocale;

  // Check if the first segment is a supported locale
  if (supportedLocales.includes(segments[1])) {
    activeLocale = segments[1];
  } else {
    activeLocale = 'en'; // Default locale
  }

  console.log(activeLocale);

  return <div>this is {activeLocale} this</div>;
}
