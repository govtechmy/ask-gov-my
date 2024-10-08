import type {
  MiddlewareFunction,
  MiddlewareResponseProps,
} from "@/lib/decorator";
import { HttpStatusCode } from "@askgovmy/utils";
import { route } from "@/lib/routes";

/**
 * Checks user authentication
 * @param props Context
 * @returns {MiddlewareResponseProps}
 */
const RedirectIfAuthenticated: MiddlewareFunction = async ({
  context,
}): Promise<MiddlewareResponseProps> =>
  new Promise(async (resolve, reject) => {
    if (context.session !== null) {
      return reject({
        status: HttpStatusCode.TEMPORARY_REDIRECT_307,
        message: "User authenticated. Redirecting.",
        redirect: route("admin.dashboard", null),
      });
    }

    resolve({
      status: HttpStatusCode.OK_200,
      message: "No session found.",
    });
  });

export default RedirectIfAuthenticated;
