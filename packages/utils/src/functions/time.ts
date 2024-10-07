import { DateTime } from "luxon";

export const since = (
  value: string,
  locale: "ms-MY" | "en-GB"
): string | null => {
  return DateTime.fromSQL(value).setLocale(locale).toRelative()
    ? DateTime.fromSQL(value).setLocale(locale).toRelative()
    : DateTime.fromISO(value).setLocale(locale).toRelative();
};
