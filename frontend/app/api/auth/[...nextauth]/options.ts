import { DefaultSession, NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { createTransport } from 'nodemailer';
import { DjangoAdapter } from './adapter';
import email_html from './email_html';

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
  callbacks: {
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
