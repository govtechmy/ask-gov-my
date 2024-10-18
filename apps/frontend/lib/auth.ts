import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession, Session } from "next-auth";

export function getSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}
