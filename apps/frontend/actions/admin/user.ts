"use server";
import api from "@/lib/api";
import { Context } from "@/lib/decorator";
import { paginate } from "@/lib/server-helper";
import { ApiParams, User } from "@/types/types";
import { HttpStatusCode, withResponse, Yikes } from "@askgovmy/utils";

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
    context: Context
  ) => {
    if (!context.session) throw new Yikes("E_201_NOT_AUTHORIZED");

    const data = await api("/admin/users", {
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
    });

    return {
      data: paginate(data.results, data.count, page, page_size),
      message: "Successfully fetch agencies",
      status: HttpStatusCode.OK_200,
    };
  }
);
