import { DefaultUser } from "next-auth";

interface IUser extends DefaultUser {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  role: "staff" | "super_admin";
  agency: number;
}

declare module "next-auth" {
  interface User extends IUser {}

  interface Session {
    user: User;
  }
}
