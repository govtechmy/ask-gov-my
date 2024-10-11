import type { MiddlewareFunction } from "@/lib/decorator";
import { HttpStatusCode } from "@askgovmy/utils";
import { route } from "@/lib/routes";

/**
 * Checks user role and authorizes if user has the role for the page
 * @param props Context
 * @returns {MiddlewareResponseProps}
 */
const MustBeAuthorized = (
  // List of all roles
  permissions: Array<"staff" | "super_admin">
): MiddlewareFunction => {
  return ({ context }) =>
    new Promise(async (resolve, reject) => {
      const session = context.session;
      if (session === null) {
        return reject({
          status: HttpStatusCode.UNAUTHORIZED_401,
          message: "Unauthenticated access",
          redirect: route("admin.index", null),
        });
      }

      const { user } = session;

      const isValid = permissions.some(
        (permission) => permission === user.role
      );

      if (!isValid) {
        return reject({
          status: HttpStatusCode.FORBIDDEN_403,
          message:
            "Forbidden. Unauthorized access. You cannot access this page",
        });
      }

      console.log("this run", isValid);

      resolve({
        status: HttpStatusCode.OK_200,
        message: "Authorized to access this page",
      });
    });
};

export default MustBeAuthorized;
