"use server";
import api from "@/lib/api";
import { getSession } from "@/lib/auth";
import { Context } from "@/lib/decorator";
import { route } from "@/lib/routes";
import { paginate } from "@/lib/server-helper";
import { ApiParams } from "@/types/types";
import { HttpStatusCode, withResponse, Yikes } from "@askgovmy/utils";
import { revalidatePath } from "next/cache";

type getQuestionsProps = ApiParams & {
  agency?: number;
  agency__isnull?: string;
  state?:
    | "answered"
    | "draft"
    | "spam"
    | "unanswered"
    | "assigned"
    | "unassigned";
};

/**
 *  @Method: GET
 *
 *  @Response: List of questions in admin dashboard
 *
 */
export const getQuestionsList = withResponse(
  async (
    { page = 1, page_size = 10, search = "", agency, state }: getQuestionsProps,
    context: Context
  ) => {
    if (!context.session) throw new Yikes("E_201_NOT_AUTHORIZED");

    const data = await api("/admin/questions", {
      params: {
        page,
        page_size,
        search,
        ...(agency && { agency }),
        ...(state && { state }),
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

type MarkQuestionSpamArgs = { id: string; spam: boolean };
export const markQuestionSpam = withResponse(
  async ({ id, spam }: MarkQuestionSpamArgs) => {
    const session = await getSession();
    if (session?.user.role !== "super_admin")
      throw new Yikes("E_201_NOT_AUTHORIZED");

    await api(`/admin/questions/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${session.accessToken}`,
      },
      body: {
        spam,
      },
    });

    revalidatePath(route("admin.dashboard.index", undefined));

    return {
      message: "Sucesfully update this question",
      status: HttpStatusCode.OK_200,
    };
  }
);

type AssignAgencyToQuestionArgs = { id: string; agency: number | null };
export const assignAgencyToQuestion = withResponse(
  async ({ id, agency }: AssignAgencyToQuestionArgs) => {
    const session = await getSession();
    if (session?.user.role !== "super_admin")
      throw new Yikes("E_201_NOT_AUTHORIZED");

    await api(`/admin/questions/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${session.accessToken}`,
      },
      body: {
        agency,
      },
    });

    revalidatePath(route("admin.dashboard.index", undefined));

    return {
      message: "Sucesfully assign agency to this question",
      status: HttpStatusCode.OK_200,
    };
  }
);

/**
 *  @Method: GET
 *
 *  @Response: List of topics for the agency the staff is in in admin dashboard
 *
 */
export const getAdminTopicList = withResponse(
  async ({ agency }: { agency?: number }, context: Context) => {
    if (!context.session) throw new Yikes("E_201_NOT_AUTHORIZED");

    if (!agency) throw new Yikes("E_303_INSUFFICIENT_INPUT");

    const data = await api("/admin/topics", {
      params: {
        agency,
      },
      headers: {
        Authorization: `Token ${context.session.accessToken}`,
      },
    });

    return {
      data: data,
      message: "Successfully fetch topic list",
      status: HttpStatusCode.OK_200,
    };
  }
);

export const createNewTopic = withResponse(
  async ({ title }: { title: string }, locale: "ms-MY" | "en-GB") => {
    const session = await getSession();
    if (!session) throw new Yikes("E_201_NOT_AUTHORIZED");

    const response = await api("/admin/topics/", {
      method: "POST",
      body: {
        title_ms: title,
        title_en: title,
        agency: session.user.agency?.id,
      },
      headers: {
        Authorization: `Token ${session.accessToken}`,
      },
    });

    revalidatePath("/admin/dashboard");

    return {
      data: response,
      message: "Sucesfully created new topic",
      status: HttpStatusCode.OK_200,
    };
  }
);

export const createNewAnswer = withResponse(
  async (body: {
    question: number;
    raw: string;
    text: string;
    draft: boolean;
  }) => {
    const session = await getSession();
    if (!session) throw new Yikes("E_201_NOT_AUTHORIZED");

    if (!body.draft && !body.text.trim())
      throw new Yikes("E_303_INSUFFICIENT_INPUT");

    const response = await api("/admin/answers/", {
      method: "POST",
      body,
      headers: {
        Authorization: `Token ${session.accessToken}`,
      },
    });

    revalidatePath("/admin/dashboard");

    return {
      data: response,
      message: "Sucesfully created new answer",
      status: HttpStatusCode.OK_200,
    };
  }
);

export const updateCurrentAnswer = withResponse(
  async (
    answerId: string,
    body: {
      question: number;
      raw: string;
      text: string;
      draft: boolean;
    }
  ) => {
    const session = await getSession();
    if (!session) throw new Yikes("E_201_NOT_AUTHORIZED");

    if (!body.draft && !body.text.trim())
      throw new Yikes("E_303_INSUFFICIENT_INPUT");

    const response = await api(`/admin/answers/${answerId}/`, {
      method: "PUT",
      body,
      headers: {
        Authorization: `Token ${session.accessToken}`,
      },
    });

    revalidatePath("/admin/dashboard");

    return {
      data: response,
      message: "Sucesfully update answer",
      status: HttpStatusCode.OK_200,
    };
  }
);
