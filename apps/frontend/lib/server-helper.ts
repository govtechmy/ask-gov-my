import { PageResult } from "@/types/types";
import { headers } from "next/headers";

/**
 * Get the router information of. Composed as part of page context
 * @returns {URL} URL class object of current path
 */
export const getURLRouter = (): URL => {
  const heads = headers();
  // Just in case, if x-url is not present, return default URL
  if (!heads.has("x-url")) return new URL(process.env.APP_URL);

  const url = new URL(heads.get("x-url") || "");
  return url;
};

/**
 * Return the query in pagination form
 * @returns {PageResult<T>}
 */

export const paginate = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PageResult<T> => {
  return {
    results: data,
    page: {
      max: Math.ceil(total / limit),
      current: Number(page),
      total: total,
      limit: limit,
    },
  };
};

/**
 * Return the ip address of the current request context.
 *
 * If the ip address is unknown, 0.0.0.0 is returned.
 * @returns {string} IPv4/IPv6 address
 */
export function getIPAddress(): string | null {
  return headers().get("x-forwarded-for");
}
