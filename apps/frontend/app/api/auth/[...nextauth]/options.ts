import { DefaultSession, NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { createTransport } from "nodemailer";
import { DjangoAdapter } from "./adapter";
import email_html from "./email_html";
import GoogleProvider from "next-auth/providers/google";
import { checkUserEmailExists } from "@/actions/userServices";

// Extend the built-in session type
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      role: "staff" | "super_admin";
      agency: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    role: "staff" | "super_admin";
    agency: number;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url, provider }) {
        const transport = createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          auth: {
            user: process.env.EMAIL_AUTH_USER,
            pass: process.env.EMAIL_AUTH_PASS,
          },
        });
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: "Log masuk ke AskMyGov",
          text: `Sign in to AskMyGov\n${url}\n\n`,
          html: email_html({ url, host: "AskMyGov" }),
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: DjangoAdapter(),
  pages: {
    signIn: "/admin",
    verifyRequest: "/admin/checkmail",
    // verifyRequest: "/admin/login-verification",
    error: "/",
  },
  session: {
    strategy: "database",
    // maxAge: 12 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return await checkUserEmailExists(user.email as string);
    },
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: user.role,
          agency: user.agency,
        },
      };
    },
  },
};
