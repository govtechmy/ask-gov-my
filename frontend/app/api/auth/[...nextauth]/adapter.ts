import { get, post, put } from '@/lib/api';
import type {
  Adapter,
  AdapterUser,
  AdapterSession,
  VerificationToken,
} from 'next-auth/adapters';

const API_URL = process.env.API_URL;

export const DjangoAdapter = (): Adapter => {
  return {
    async createVerificationToken(verificationToken) {
      return await post(`${API_URL}/auth/verification`, verificationToken);
    },

    async useVerificationToken({ identifier, token }) {
      const verificationToken = await put<VerificationToken>(
        `${API_URL}/auth/verification`,
        { identifier, token },
      );
      if (!verificationToken) return null;
      return <VerificationToken>{
        ...verificationToken,
        expires: new Date(verificationToken.expires),
      };
    },

    async createUser(user) {
      const createdUser = await post<AdapterUser>(`${API_URL}/auth/user`, user);
      if (!createdUser) throw new Error('Failed to create user');
      return createdUser;
    },

    async getUser(id) {
      return await get(`${API_URL}/auth/user`, { id });
    },

    async getUserByEmail(email) {
      const res = await get(`${API_URL}/auth/user`, { email });
      return await get(`${API_URL}/auth/user`, { email });
    },

    async getUserByAccount({ providerAccountId, provider }) {
      try {
        const response = await fetch(
          `${API_URL}/auth/account?provider=${provider}&providerAccountId=${providerAccountId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
          },
        );
        const data = await response.json();

        if (response.ok && data.status === 'success') {
          return {
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            emailVerified: data.data.emailVerified,
            role: data.data.role,
            agency: data.data.agency,
          };
        } else if (response.status === 404) {
          // In the case of account not found
          return null;
        } else {
          // Handle other types of errors
          console.error('Error fetching user account:', data.data.message);
          return null;
        }
      } catch (error) {
        console.error('Error in getUserByAccount:', error);
        return null;
      }
    },

    async updateUser(user) {
      const updatedUser = await put<AdapterUser>(`${API_URL}/auth/user`, user);
      if (!updatedUser) {
        throw new Error('Failed to update user');
      }
      return updatedUser;
    },

    async linkAccount(account) {
      await post(`${API_URL}/auth/account`, account);
    },

    async getSessionAndUser(sessionToken) {
      const session_and_user = await get<{
        session: AdapterSession;
        user: AdapterUser;
      }>(`${API_URL}/auth/session`, { sessionToken });
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

    async createSession({ sessionToken, userId, expires }) {
      const session = await post<AdapterSession>(`${API_URL}/auth/session`, {
        sessionToken,
        userId,
        expires,
      });
      if (!session) {
        throw new Error('Failed to create session');
      }
      return {
        userId: session.userId,
        sessionToken: session.sessionToken,
        expires: new Date(session.expires),
      };
    },

    async updateSession(session) {
      const updatedSession = await put<AdapterSession>(
        `${API_URL}/auth/session`,
        session,
      );
      if (
        !updatedSession ||
        !updatedSession.sessionToken ||
        !updatedSession.userId ||
        !updatedSession.expires
      ) {
        throw new Error(
          'Failed to update session or invalid response from API',
        );
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
