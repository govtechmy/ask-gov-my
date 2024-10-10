import type {
  MiddlewareFunction,
  MiddlewareResponseProps,
} from "@/lib/decorator";
import { HttpStatusCode } from "@askgovmy/utils";
import { route } from "@/lib/routes";
import { getURLRouter } from "@/lib/server-helper";

/**
 * Checks user authentication
 * @param props Context
 * @returns {MiddlewareResponseProps}
 */
const MustBeAuthenticated: MiddlewareFunction = async ({
  context,
}): Promise<MiddlewareResponseProps> =>
  new Promise(async (resolve, reject) => {
    if (context.session === null) {
      return reject({
        status: HttpStatusCode.UNAUTHORIZED_401,
        message: "Unauthenticated access",
        redirect: route("admin.index", null),
      });
    }

    resolve({
      status: HttpStatusCode.OK_200,
      message: "Authenticated access",
    });
  });

export default MustBeAuthenticated;
