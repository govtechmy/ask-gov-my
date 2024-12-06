"use server";
import api from "@/lib/api";
import { getSession } from "@/lib/auth";
import { Context } from "@/lib/decorator";
import { paginate } from "@/lib/server-helper";
import { ApiParams, User } from "@/types/types";
import { HttpStatusCode, withResponse, Yikes } from "@askgovmy/utils";
import { revalidatePath } from "next/cache";

type getUsersProps = ApiParams & {
  role?: User["role"];
  agency?: number;
};

/**
 *  @Method: GET
 *
 *  @Response: List of all users in admin dashboard
 *
 */
export const getUsers = withResponse(
  async (
    { page = 1, page_size = 8, search = "", role, agency }: getUsersProps,
    context: Context,
    params: Record<string, any>
  ) => {
    if (!context.session) throw new Yikes("E_201_NOT_AUTHORIZED");

    const lang: string | undefined = params.locale;

    const data = await api(
      "/admin/users",
      {
        params: {
          page,
          page_size,
          search,
          ...(role && { role }),
          ...(agency && { agency }),
        },
        headers: {
          Authorization: `Token ${context.session.accessToken}`,
        },
      },
      lang
    );

    return {
      data: paginate(data.results, data.count, page, page_size),
      message: "Successfully fetch users",
      status: HttpStatusCode.OK_200,
    };
  }
);

type CreateUserBody = {
  name: string;
  email: string;
  role: "staff" | "super_admin";
  agency: number | null;
};
export const createUser = withResponse(async (body: CreateUserBody) => {
  const session = await getSession();
  if (session?.user.role !== "super_admin")
    throw new Yikes("E_201_NOT_AUTHORIZED");

  await api("/admin/users/", {
    method: "POST",
    body,
    headers: {
      Authorization: `Token ${session.accessToken}`,
    },
  });

  revalidatePath("/admin/dashboard/user");

  return {
    message: "Sucesfully created user",
    status: HttpStatusCode.OK_200,
  };
});

type UpdateUserBody = CreateUserBody & { id: string };
export const updateUser = withResponse(async (body: UpdateUserBody) => {
  const session = await getSession();
  if (session?.user.role !== "super_admin")
    throw new Yikes("E_201_NOT_AUTHORIZED");

  await api(`/admin/users/${body.id}/`, {
    method: "PUT",
    body,
    headers: {
      Authorization: `Token ${session.accessToken}`,
    },
  });

  revalidatePath("/admin/dashboard/user");

  return {
    message: "Sucesfully updated user",
    status: HttpStatusCode.OK_200,
  };
});

type DeleteUserArgs = { id: string };
export const deleteUser = withResponse(async ({ id }: DeleteUserArgs) => {
  const session = await getSession();
  if (session?.user.role !== "super_admin")
    throw new Yikes("E_201_NOT_AUTHORIZED");

  await api(`/admin/users/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${session.accessToken}`,
    },
  });

  revalidatePath("/admin/dashboard/user");

  return {
    message: "Sucesfully deleted user",
    status: HttpStatusCode.OK_200,
  };
});
