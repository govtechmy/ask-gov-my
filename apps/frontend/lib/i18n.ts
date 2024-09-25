import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { LocalePrefix } from "next-intl/routing";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Can be imported from a shared config
export const defaultLocale = "ms-MY";
export const locales = [defaultLocale, "en-GB"];
export const localePrefix = "as-needed" satisfies LocalePrefix;

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
  createSharedPathnamesNavigation({ locales });

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
