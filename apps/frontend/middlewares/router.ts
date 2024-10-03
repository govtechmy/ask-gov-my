import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { NextMiddleware } from "./chain";
import { locales } from "@/lib/i18n";
import { getToken } from "next-auth/jwt";

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  // next-auth's getToken utility will verify the JWT
  const jwt = await getToken({ req });
  return jwt !== null;
}

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
      const isLoggedIn = await isAuthenticated(request);

      if (!isExcludedPath && !isLoggedIn) {
        // Redirect to /admin login page if user is not authenticated
        return NextResponse.redirect(new URL("/admin", request.url));
      } else if (pathname.endsWith("/admin") || pathname.endsWith("/admin/")) {
        // Check if user is already authenticated when accessing /admin so that login page is not accessible to logged in user
        if (isLoggedIn) {
          // Redirect to dashboard if already authenticated
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url)
          );
        }
      }
    }
    return middleware(request, event, response);
  };
};
