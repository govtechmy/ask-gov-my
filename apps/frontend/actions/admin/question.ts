"use server";
import api from "@/lib/api";
import { getSession } from "@/lib/auth";
import { Context } from "@/lib/decorator";
import { route } from "@/lib/routes";
import { paginate } from "@/lib/server-helper";
import { ApiParams } from "@/types/types";
import {
  getTimestamp,
  HttpStatusCode,
  withResponse,
  Yikes,
} from "@askgovmy/utils";
import { revalidatePath } from "next/cache";
import mime from "mime-types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3";

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

export const assignQuestionTopic = withResponse(
  async (questionId: string, body: { topics: number[] }) => {
    const session = await getSession();
    if (!session) throw new Yikes("E_201_NOT_AUTHORIZED");

    console.log(body);

    const response = await api(`/admin/questions/${questionId}/topics/`, {
      method: "PUT",
      body,
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

export async function getAttachmentPresignedURL({
  fileType,
  fileName,
  fileSize,
}: {
  fileType: string;
  fileName: string;
  fileSize: number;
}): Promise<{ uploadUrl: string; downloadUrl: string }> {
  const session = await getSession();
  if (!session) throw new Yikes("E_201_NOT_AUTHORIZED");

  if (fileSize > 10485760) throw new Yikes("E_302_VALIDATION_ERROR");

  let key = `${fileName}`;
  const fileExtension = mime.extension(fileType);

  if (
    fileExtension &&
    !["jpg", "jpeg", "png", "webp", "pdf"].includes(fileExtension)
  ) {
    throw new Yikes("E_302_VALIDATION_ERROR");
  }

  const command = new PutObjectCommand({
    Bucket: process.env.STORAGE_BUCKET,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5,
  });
  const downloadUrl = `${process.env.STORAGE_BASE_URL}/${key}`;

  return { uploadUrl, downloadUrl };
}

export const createQuestionAttachment = withResponse(
  async (body: { question: number; file_key: string; file_size: number }) => {
    const session = await getSession();
    if (!session) throw new Yikes("E_201_NOT_AUTHORIZED");

    const response = await api(`/admin/attachments/`, {
      method: "POST",
      body,
      headers: {
        Authorization: `Token ${session.accessToken}`,
      },
    });

    return {
      data: response,
      message: "Sucesfully deleted the attachment answer",
      status: HttpStatusCode.OK_200,
    };
  }
);
export const deleteQuestionAttachment = withResponse(
  async (attachmentId: string) => {
    const session = await getSession();
    if (!session) throw new Yikes("E_201_NOT_AUTHORIZED");

    const response = await api(`/admin/attachments/${attachmentId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${session.accessToken}`,
      },
    });

    return {
      data: response,
      message: "Sucesfully deleted the attachment answer",
      status: HttpStatusCode.OK_200,
    };
  }
);
