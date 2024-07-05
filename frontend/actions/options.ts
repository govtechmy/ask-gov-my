import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { NextAuthOptions } from 'next-auth';
import nodemailer from "nodemailer";
import { JSXElementConstructor, ReactElement } from 'react';
import LoginLink from './logic-link';
import { sendEmail } from './sendMail';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier, url }) {
        console.log("Callback URL:" + url);
        console.log("identifier" + identifier)
        await sendEmail({
          email: identifier,
          subject: `Your ${process.env.NEXT_PUBLIC_APP_NAME} Login Link`,
          react: LoginLink({ url, email: identifier }),
        });
        return;
      }
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/admin',
    verifyRequest: '/admin/checkmail', // send users here after they sign in to check their email
    error: '/'
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.agency = token.agency as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.agency = user.agency;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/admin/dashboard")) return baseUrl + url;
      return baseUrl;
    },
  },
}