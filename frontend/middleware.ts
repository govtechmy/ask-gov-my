import { defaultLocale, localePrefix, locales } from '@/lib/i18n';
import { getServerSession } from 'next-auth';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from './app/api/auth/[...nextauth]/options';
import { get } from './lib/api';
import { AdapterSession, AdapterUser } from 'next-auth/adapters';
import path from 'path';

export default async function middleware(request: NextRequest) {
  // Create and call the next-intl middleware
  const handleI18nRouting = createIntlMiddleware({
    locales,
    localePrefix,
    defaultLocale,
  });

  const response = handleI18nRouting(request);

  // Check for admin routes
  const pathname = request.nextUrl.pathname;
  const adminPathRegex = new RegExp(`^/(${locales.join('|')})?/admin(/|$)`);

  if (adminPathRegex.test(pathname)) {
    const excludedPaths = ['/admin', '/admin/checkmail'];
    const isExcludedPath = excludedPaths.some(
      path => pathname.endsWith(path) || pathname.endsWith(`${path}/`),
    );

    if (!isExcludedPath) {
      const sessionToken = request.cookies.get(
        'next-auth.session-token',
      )?.value;

      if (!sessionToken) {
        // Redirect to /admin login page if there's no session token
        return NextResponse.redirect(new URL('/admin', request.url));
      }

      const API_URL = process.env.API_URL;
      const session_and_user = await get<{
        session: AdapterSession;
        user: AdapterUser;
      }>(`${API_URL}/auth/session`, { sessionToken });

      if (!session_and_user) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } else if (pathname.endsWith('/admin') || pathname.endsWith('/admin/')) {
      // Check if user is already authenticated when accessing /admin so that login page is not accessible to logged in user
      const sessionToken = request.cookies.get(
        'next-auth.session-token',
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
            new URL('/admin/dashboard', request.url),
          );
        }
      }
    }
  }
  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - if they start with `/api`, `/_next` or `/_vercel`
    // - the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
