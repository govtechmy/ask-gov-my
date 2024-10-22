"use server";
import api from "@/lib/api";
import { getSession } from "@/lib/auth";
import { Context } from "@/lib/decorator";
import { paginate } from "@/lib/server-helper";
import { ApiParams } from "@/types/types";
import { HttpStatusCode, withResponse, Yikes } from "@askgovmy/utils";
import { revalidatePath } from "next/cache";
import { AgencyFormValues } from "./agency.schema";

/**
 *  @Method: GET
 *
 *  @Response: List of all agencies in admin dashboard
 *
 */
export const getAgencies = withResponse(
  async (
    { page = 1, page_size = 24, search = "" }: ApiParams,
    context: Context
  ) => {
    if (!context.session) throw new Yikes("E_201_NOT_AUTHORIZED");

    const data = await api("/admin/agencies", {
      params: {
        page,
        page_size,
        search,
      },
      headers: {
        Authorization: `Token ${context.session.accessToken}`,
      },
    });

    return {
      data: paginate(data.results, data.count, page, page_size),
      message: "Successfully fetch agencies",
      status: HttpStatusCode.OK_200,
    };
  }
);

type CreateAgencyBody = AgencyFormValues;
export const createAgency = withResponse(async (body: CreateAgencyBody) => {
  const session = await getSession();
  if (session?.user.role !== "super_admin")
    throw new Yikes("E_201_NOT_AUTHORIZED");

  await api("/admin/agencies/", {
    method: "POST",
    body,
    headers: {
      Authorization: `Token ${session.accessToken}`,
    },
  });

  revalidatePath("/admin/dashboard/agency");

  return {
    message: "Sucesfully created agency",
    status: HttpStatusCode.OK_200,
  };
});

type UpdateAgencyBody = AgencyFormValues & { id: number };
export const updateAgency = withResponse(async (body: UpdateAgencyBody) => {
  const session = await getSession();
  if (session?.user.role !== "super_admin")
    throw new Yikes("E_201_NOT_AUTHORIZED");

  await api(`/admin/agencies/${body.id}/`, {
    method: "PUT",
    body,
    headers: {
      Authorization: `Token ${session.accessToken}`,
    },
  });

  revalidatePath("/admin/dashboard/agency");

  return {
    message: "Sucesfully updated agency",
    status: HttpStatusCode.OK_200,
  };
});
