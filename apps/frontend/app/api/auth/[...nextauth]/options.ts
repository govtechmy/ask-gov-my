import { confirmLoginByCode, loginByGoogle } from "@/lib/allauth";
import { DefaultSession, NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// import { checkUserEmailExists } from "@/actions/userServices";

// Extend the built-in session type
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      role: "staff" | "super_admin";
      agency: number | null;
    } & DefaultSession["user"];
    /** Access token for our Django API */
    accessToken: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    role: "staff" | "super_admin";
    agency: number | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** sub is the user ID */
    sub: string;
    name: string;
    email: string;
    role: "staff" | "super_admin";
    agency: number | null;
    /** Access token for our Django API */
    accessToken: string;
  }
}

/**
 * This is the result after a successful sign-in. We include extra fields like
 * accessToken in the user object so it can be passed to the JWT.
 */
type SignInData = User & {
  accessToken: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      id: "code",
      credentials: { code: { type: "password" } },
      authorize: async (credentials) => {
        if (!credentials) {
          throw Error("failed to login with code: missing credentials");
        }
        const authData = await confirmLoginByCode(credentials.code);
        return {
          id: authData.user.id,
          name: authData.user.name,
          email: authData.user.email,
          emailVerified: null,
          role: authData.user.role,
          agency: authData.user.agency,
          accessToken: authData.accessToken,
        } satisfies SignInData;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12 hours
  },
  callbacks: {
    signIn: async ({ account, user }) => {
      if (account?.provider === "google") {
        const idToken = account["id_token"];
        if (!idToken) {
          throw Error(
            "failed to login with google: missing idToken in callback"
          );
        }
        const authData = await loginByGoogle(idToken);
        user.id = authData.user.id;
        user.name = authData.user.name;
        user.email = authData.user.email;
        user.emailVerified = null;
        user.role = authData.user.role;
        user.agency = authData.user.agency;
        // @ts-expect-error include `acccessToken` in the user object for the jwt callback
        user.accessToken = authData.accessToken;
        return true;
      }
      return true;
    },
    jwt: async ({ user, trigger, token }) => {
      if (trigger === "signIn") {
        const signInData = user as SignInData;
        return {
          sub: signInData.id,
          name: signInData.name,
          email: signInData.email,
          role: signInData.role,
          agency: signInData.agency,
          accessToken: signInData.accessToken,
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        id: token.sub,
        name: token.name,
        email: token.email,
        role: token.role,
        agency: token.agency,
      };
      session.accessToken = token.accessToken;
      return session;
    },
  },
};
