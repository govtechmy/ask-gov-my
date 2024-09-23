import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { NextMiddleware } from "./chain";
import { locales } from "@/lib/i18n";
import { get } from "@/lib/api";
import { AdapterSession, AdapterUser } from "next-auth/adapters";

export const RouterMiddleware = (middleware: NextMiddleware) => {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    // TODO: FIX this
    // Check for admin routes
    const pathname = request.nextUrl.pathname;
    const adminPathRegex = new RegExp(`^/(${locales.join("|")})?/admin(/|$)`);

    if (adminPathRegex.test(pathname)) {
      const excludedPaths = ["/admin", "/admin/checkmail"];
      const isExcludedPath = excludedPaths.some(
        (path) => pathname.endsWith(path) || pathname.endsWith(`${path}/`)
      );

      if (!isExcludedPath) {
        const sessionToken = request.cookies.get(
          "next-auth.session-token"
        )?.value;

        if (!sessionToken) {
          // Redirect to /admin login page if there's no session token
          return NextResponse.redirect(new URL("/admin", request.url));
        }

        const API_URL = process.env.API_URL;
        const session_and_user = await get<{
          session: AdapterSession;
          user: AdapterUser;
        }>(`${API_URL}/auth/session`, { sessionToken });

        if (!session_and_user) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      } else if (pathname.endsWith("/admin") || pathname.endsWith("/admin/")) {
        // Check if user is already authenticated when accessing /admin so that login page is not accessible to logged in user
        const sessionToken = request.cookies.get(
          "next-auth.session-token"
        )?.value;

        if (sessionToken) {
          const API_URL = process.env.API_URL;
          const session_and_user = await get<{
            session: AdapterSession;
            user: AdapterUser;
          }>(`${API_URL}/auth/session`, { sessionToken });

          if (session_and_user) {
            // Redirect to dashboard if already authenticated
            return NextResponse.redirect(
              new URL("/admin/dashboard", request.url)
            );
          }
        }
      }
    }
    return middleware(request, event, response);
  };
};
