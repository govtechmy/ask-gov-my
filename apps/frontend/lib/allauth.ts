import { cookies } from "next/headers";
import { z } from "zod";

const AuthDataSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(["super_admin", "staff"]),
    agency: z.number().nullable(),
  }),
  accessToken: z.string(),
});
type AuthData = z.infer<typeof AuthDataSchema>;

type AuthResponseMessage = {
  status: number;
  data?: Record<string, unknown>;
  errors?: Array<unknown>;
  meta?: Record<string, unknown>;
};

// allauth session token is only read during signin/signup flows
const COOKIE_NAME = "allauth.session-token";

function getSessionToken(): string | null {
  return cookies().get(COOKIE_NAME)?.value || null;
}
function saveSessionToken(token: string): void {
  cookies().set(COOKIE_NAME, token);
}
function deleteSessionToken(): void {
  cookies().delete(COOKIE_NAME);
}

const BASE_URL = process.env.AUTH_BASE_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const URLs = {
  GET_SESSION: BASE_URL + "/app/v1/auth/session",
  REQUEST_LOGIN_CODE: BASE_URL + "/app/v1/auth/code/request",
  CONFIRM_LOGIN_CODE: BASE_URL + "/app/v1/auth/code/confirm",
  LOGIN_BY_GOOGLE: BASE_URL + "/app/v1/auth/provider/token",
} as const;

async function fetchAuth(
  method: string,
  url: string,
  data?: unknown
): Promise<AuthResponseMessage> {
  const headers: HeadersInit = {
    Accept: "application/json",
  };
  const sessionToken = getSessionToken();
  if (sessionToken) {
    headers["X-Session-Token"] = sessionToken;
  }

  const opts: RequestInit = {
    method,
    headers,
  };

  if (data) {
    opts.body = JSON.stringify(data);
  }

  const response = await fetch(url, opts);
  const status = response.status;
  const msg = await response.json();

  // allauth returns status 410 to indicate an invalid session token
  // We need to delete the token and start clean
  if (status === 410) {
    deleteSessionToken();
    throw Error(`invalid allauth session token, status: ${status}`);
  }

  // Persist session_token whenever we get one
  if (msg.meta?.session_token) {
    saveSessionToken(msg.meta.session_token);
  }
  return msg;
}

function parseAuthMessage(msg: AuthResponseMessage): AuthData {
  const authData = AuthDataSchema.parse({
    user: msg.data?.user,
    accessToken: msg.meta?.access_token,
  });
  return authData;
}

export async function requestLoginByCode(email: string): Promise<void> {
  const msg = await fetchAuth("POST", URLs.REQUEST_LOGIN_CODE, { email });
  // allauth doesn't return status 2XX for this endpoint
  // Instead, status code 401 is expected
  if (msg.status !== 401) {
    throw Error(`failed to request login by code, status: ${msg.status}`);
  }
}

export async function confirmLoginByCode(code: string): Promise<AuthData> {
  const msg = await fetchAuth("POST", URLs.CONFIRM_LOGIN_CODE, { code });
  if (msg.status !== 200) {
    throw Error(`failed to confirm login code, status: ${msg.status}`);
  }
  deleteSessionToken(); // Delete session token on successful login flow
  return parseAuthMessage(msg);
}

export async function loginByGoogle(idToken: string): Promise<AuthData> {
  const msg = await fetchAuth("POST", URLs.LOGIN_BY_GOOGLE, {
    provider: "google",
    process: "login",
    token: {
      client_id: GOOGLE_CLIENT_ID,
      id_token: idToken,
    },
  });
  if (msg.status !== 200) {
    throw Error(`failed to login by google, status: ${msg.status}`);
  }
  deleteSessionToken(); // Delete session token on successful login flow
  return parseAuthMessage(msg);
}
