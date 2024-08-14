import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { NextAuthOptions } from 'next-auth';
import { get, post, put } from '@/lib/api';
import type {
  Adapter,
  AdapterUser,
  VerificationToken,
  AdapterSession,
  AdapterAccount
} from "@auth/core/adapters";
const API_URL = process.env.API_URL;

const DjangoAdapter = (): Adapter => {
  return {
    async createVerificationToken(verificationToken: VerificationToken) {
      return await post(`${API_URL}/auth/verification`, verificationToken);
    },

    async useVerificationToken({ identifier, token }) {
      return await put(`${API_URL}/auth/verification`, { identifier, token });
    },

    async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
      const createdUser = await post<AdapterUser>(`${API_URL}/auth/user`, user);
      if (!createdUser) {
        throw new Error('Failed to create user');
      }
      return createdUser;
    },

    async getUser(id) {
      return await get(`${API_URL}/auth/user`, { id });
    },

    async getUserByEmail(email) {
      return await get(`${API_URL}/auth/user`, { email });
    },

    async getUserByAccount({ providerAccountId, provider }) {
      return await get(`${API_URL}/auth/user`, { providerAccountId, provider });
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {
      const updatedUser = await put<AdapterUser>(`${API_URL}/auth/user`, user);
      if (!updatedUser) {
        throw new Error('Failed to update user');
      }
      return updatedUser;
    },

    async linkAccount(account: AdapterAccount): Promise<AdapterAccount> {
      const linkedAccount = await post<AdapterAccount>(`${API_URL}/auth/account`, account);
      if (!linkedAccount) {
        throw new Error('Failed to link account');
      }
      return linkedAccount;
    },

    async getSessionAndUser(sessionToken) {
      const session_and_user = await get<{ session: AdapterSession; user: AdapterUser; } | null>(
        `${API_URL}/auth/session`, 
        { sessionToken }
      );
      if (!session_and_user) return null;
      return {
        session: {
          userId: session_and_user.session.userId,
          sessionToken: session_and_user.session.sessionToken,
          expires: new Date(session_and_user.session.expires),
        },
        user: session_and_user.user,
      };
    },

    async createSession({ sessionToken, userId, expires }): Promise<AdapterSession> {
      const session = await post<AdapterSession>(`${API_URL}/auth/session`, { sessionToken, userId, expires });
      if (!session) {
        throw new Error('Failed to create session');
      }
      return {
        userId: session.userId,
        sessionToken: session.sessionToken,
        expires: new Date(session.expires),
      };
    },

    async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">): Promise<AdapterSession | null> {
      const updatedSession = await put<AdapterSession>(`${API_URL}/auth/session`, session);
      if (!updatedSession || !updatedSession.sessionToken || !updatedSession.userId || !updatedSession.expires) {
        throw new Error('Failed to update session or invalid response from API');
      }
      return {
        userId: updatedSession.userId,
        sessionToken: updatedSession.sessionToken,
        expires: new Date(updatedSession.expires),
      };
    },
    
    async deleteSession(sessionToken) {
      await post(`${API_URL}/auth/session`, { sessionToken });
    },

    async unlinkAccount(partialAccount) {
      await post(`${API_URL}/auth/account`, partialAccount);
    },
  };
};


export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier, url }) {
        //create function to send the magic link to django
        //django will send the magic link to the users
        console.log(`Magic link URL: ${url}`);
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
      if (user) {
        session.user = user;
      }
      return session;
      //remove session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/admin/dashboard')) return baseUrl + url;
      return baseUrl;
    },
  },
};
export default NextAuth(authOptions);
