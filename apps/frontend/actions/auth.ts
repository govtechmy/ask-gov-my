"use server";

import { requestLoginByCode } from "@/lib/allauth";
import { redirect } from "next/navigation";

export async function requestLoginCodeAction(email: string) {
  await requestLoginByCode(email);
  redirect("/admin/checkmail");
}
