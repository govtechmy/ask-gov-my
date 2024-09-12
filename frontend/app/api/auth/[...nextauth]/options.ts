import { DefaultSession, NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { createTransport } from 'nodemailer';
import { DjangoAdapter } from './adapter';
import email_html from './email_html';
import GoogleProvider from 'next-auth/providers/google';
import { checkUserEmailExists } from '@/actions/userServices';

// Extend the built-in session type
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      role: 'staff' | 'super_admin';
      agency: number;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    role: 'staff' | 'super_admin';
    agency: number;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    EmailProvider({
      async sendVerificationRequest({ identifier, url }) {
        //create function to send the magic link to django
        //django will send the magic link to the users
        console.log(`Magic link URL: ${url}`);
        // NOTE: You are not required to use `nodemailer`
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
          from: process.env.EMAIL_FROM,
          subject: 'Log masuk ke AskMyGov',
          text: `Sign in to AskMyGov\n${url}\n\n`,
          html: email_html({ url, host: 'AskMyGov' }),
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`);
        }
      },
    }),
  ],
  adapter: DjangoAdapter(),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/admin',
    verifyRequest: '/admin/checkmail',
    error: '/',
  },
  session: {
    strategy: 'database',
  },
  debug: true,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.type === 'email') {
        // Only check on initial sign-in attempt, not on email link click
        if (email?.verificationRequest) {
          return await checkUserEmailExists(user.email);
        }
        return true; // Allow if they've clicked the login link from email
      }

      if (account?.provider === 'google') {
        const res = await checkUserEmailExists(profile?.email as string);
        return res;
      }
      return false; // false for any other provider other than Google and EmailProvider
    },
    async session({ session, user }) {
      console.log('session', session);
      console.log('user', user);
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
