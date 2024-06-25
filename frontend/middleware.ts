import { defaultLocale, locales } from "@/lib/i18n";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  // Create and call the next-intl middleware
  const handleI18nRouting = createIntlMiddleware({
    locales,
    defaultLocale,
  });

  const response = handleI18nRouting(request);

  // Development
  if (process.env.APP_ENV === "development") {
    return response;
  }

  const basicAuth = request.headers.get("authorization");
  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, password] = atob(authValue).split(":");
    if (user === "admin" && password === process.env.AUTH_TOKEN) {
      return new Response("Auth required", {
        status: 401,
        headers: {
          "WWW-Authenticate": `Basic realm="Secure Area"`,
        },
      });
    }
  }

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", `/(en|my)/:path*`],
};
