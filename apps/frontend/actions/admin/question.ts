"use server";
import api from "@/lib/api";
import { Context } from "@/lib/decorator";
import { paginate } from "@/lib/server-helper";
import { ApiParams } from "@/types/types";
import { HttpStatusCode, withResponse, Yikes } from "@askgovmy/utils";

type getQuestionsProps = ApiParams & {
  agency?: number;
  agency__isnull?: string;
  state?: "answered" | "draft" | "spam" | "unanswered";
};

/**
 *  @Method: GET
 *
 *  @Response: List of questions in admin dashboard
 *
 */
export const getQuestionsList = withResponse(
  async (
    {
      page = 1,
      page_size = 10,
      search = "",
      agency,
      agency__isnull,
      state,
    }: getQuestionsProps,
    context: Context
  ) => {
    if (!context.session) throw new Yikes("E_201_NOT_AUTHORIZED");
    console.log("in here", agency__isnull);

    const data = await api("/admin/questions", {
      params: {
        page,
        page_size,
        search,
        ...(agency && { agency }),
        ...(state && { state }),
        ...(agency__isnull !== undefined && { agency__isnull }),
      },
      headers: {
        Authorization: `Token ${context.session.accessToken}`,
      },
    });

    return {
      data: paginate(data.results, data.count, page, page_size),
      message: "Successfully fetch questions list",
      status: HttpStatusCode.OK_200,
    };
  }
);
