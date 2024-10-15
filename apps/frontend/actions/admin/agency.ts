"use server";
import api from "@/lib/api";
import { Context } from "@/lib/decorator";
import { paginate } from "@/lib/server-helper";
import { Agency, ApiParams } from "@/types/types";
import { HttpStatusCode, withResponse, Yikes } from "@askgovmy/utils";

/**
 *  @Method: GET
 *
 *  @Response: List of all agencies in admin dashboard
 *
 */
export const getAgencies = withResponse(
  async ({ page = 1, page_size = 24 }: ApiParams, context: Context) => {
    if (!context.session) throw new Yikes("E_201_NOT_AUTHORIZED");

    const data = await api("/admin/agencies", {
      params: {
        page,
        page_size,
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
