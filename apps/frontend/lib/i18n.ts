import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { defineRouting, LocalePrefix } from "next-intl/routing";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Can be imported from a shared config
export type Locale = "ms-MY" | "en-GB";
export const defaultLocale = "ms-MY";
export const locales: Locale[] = [defaultLocale, "en-GB"];
export const localePrefix = "as-needed" satisfies LocalePrefix;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix,
});

export const localeMeta: Record<string, { full: string; short: string }> = {
  "en-GB": {
    full: "English",
    short: "ENG",
  },
  "ms-MY": {
    full: "Bahasa Melayu",
    short: "BM",
  },
};

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
