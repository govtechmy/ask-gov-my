// next-auth.d.ts

import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      agency: string;
    } & DefaultSession['user'];
    accessToken?: string;
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    agency: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    agency: string;
    accessToken?: string;
  }
}
