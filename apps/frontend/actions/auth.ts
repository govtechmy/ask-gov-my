"use server";

import { requestLoginByCode } from "@/lib/allauth";
import api from "@/lib/api";
import { redirect } from "next/navigation";

export async function requestLoginCodeAction(email: string) {
  await requestLoginByCode(email);
  redirect(`/admin/checkmail?email=${email}`);
}

export async function resendLoginCodeAction(email: string) {
  await requestLoginByCode(email);
}

export async function checkUserEmailExists(email: string): Promise<boolean> {
  try {
    const res = await api(
      `/admin/check-email?email=${encodeURIComponent(email)}`
    );
    return res.isExists;
  } catch (error) {
    return false;
  }
}
