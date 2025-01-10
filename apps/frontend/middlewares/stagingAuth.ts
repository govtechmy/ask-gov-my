import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { NextMiddleware } from "./chain";

function extractBasicAuth(
  authHeader: string
): { username: string; password: string } | null {
  if (!authHeader.startsWith("Basic ")) {
    return null;
  }

  const base64Credentials = authHeader.slice(6);
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  const [username, password] = credentials.split(":");

  if (!username || !password) {
    return null;
  }

  return { username, password };
}

const STAGING_PASSWORD = process.env.STAGING_PASSWORD;

export const StagingAuthMiddleware = (next: NextMiddleware) => {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    if (STAGING_PASSWORD) {
      const basicAuth = extractBasicAuth(
        request.headers.get("Authorization") || ""
      );
      if (
        !basicAuth ||
        basicAuth.username !== "admin" ||
        basicAuth.password !== STAGING_PASSWORD
      ) {
        return new Response("Auth required", {
          status: 401,
          headers: { "WWW-Authenticate": "Basic realm=staging" },
        });
      }
    }

    return next(request, event, response);
  };
};
