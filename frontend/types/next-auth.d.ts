import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      agency: string; 
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    agency: string; 
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    agency: string; 
  }
}