"use server";

import { requestLoginByCode } from "@/lib/allauth";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function requestLoginCodeAction(email: string) {
  await requestLoginByCode(email);
  redirect(`/admin/checkmail?email=${email}`);
}

export async function resendLoginCodeAction(email: string) {
  await requestLoginByCode(email);
}
