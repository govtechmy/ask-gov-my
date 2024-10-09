import { NextChain } from "./middlewares/chain";
import { I18nMiddleware } from "./middlewares/i18n";
import { RouterMiddleware } from "./middlewares/router";

/**
 * Note:
 * 1. Sequence of middleware matters!
 * 2. Final middleware should return NextResponse
 */
export default NextChain([I18nMiddleware]);

export const config = {
  matcher: [
    // Match all pathnames except for
    // - if they start with `/api`, `/_next` or `/_vercel`
    // - the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
