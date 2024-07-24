import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { NextAuthOptions } from 'next-auth';
import { sendEmail } from './sendMail';
import LoginLink from './logic-link';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [ //need to add function to check the email inside the db, if exists allow to login
    EmailProvider({
      async sendVerificationRequest({ identifier, url }) {
        // await sendEmail({
        //   email: identifier,
        //   subject: `Your ${process.env.NEXT_PUBLIC_APP_NAME} Login Link`,
        //   react: LoginLink({ url, email: identifier }),
        // });
        console.log(url)
        return;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/admin',
    verifyRequest: '/admin/checkmail', // send users here after they sign in to check their email
    error: '/',
  },
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.agency = token.agency as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.agency = user.agency;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/admin/dashboard')) return baseUrl + url;
      return baseUrl;
    },
  },
};

export default NextAuth(authOptions);
