"use server";
import api from "@/lib/api";
import { getIPAddress, paginate } from "@/lib/server-helper";
import { PageResult, Question, QuestionSubmission } from "@/types/types";
import { HttpStatusCode, withResponse, Yikes } from "@askgovmy/utils";

/**
 *  @Method: GET
 *  @Response: List of all questions
 */
export const getAllQuestions = withResponse(
  async (
    {
      page = 1,
      limit = 6,
      topicId,
      agencyId,
    }: {
      page: number;
      limit?: number;
      topicId?: number;
      agencyId?: number;
    },
    params: Record<string, any>
  ) => {
    const lang: string | undefined = params.locale;
    const response = await api(
      `/questions/`,
      {
        params: {
          page,
          limit,
          ...(agencyId && { agency: agencyId }),
          ...(topicId && { topics: topicId }),
        },
      },
      lang
    );
    return {
      data: paginate(response.results, response.count, page, limit),
      message: "Successfully fetch question list",
      status: HttpStatusCode.OK_200,
    };
  }
);

/**
 *  @Method: GET
 *  @Response: Search questions endpoint via ES
 */
export const searchQuestions = withResponse(
  async (
    {
      query = "",
      page = 1,
      limit = 6,
    }: {
      page: number;
      query: string;
      limit?: number;
    },
    params?: Record<string, any>
  ) => {
    const lang: string | undefined = params && params.locale;
    const response = await api(
      `/questions/search/`,
      {
        params: {
          q: query,
          page: page.toString(),
          page_size: limit.toString(),
        },
      },
      lang
    );

    return {
      data: paginate(
        response.results,
        response.count,
        page,
        limit
      ) as PageResult<Question>,
      message: "Succesfully query question",
      status: HttpStatusCode.OK_200,
    };
  }
);

/**
 *  @Method: GET
 *  @param: questionID
 *  @Response: Get question details by given ID.
 */
export const getQuestionById = withResponse(
  async (
    { questionId }: { questionId: string },
    params: Record<string, any>
  ) => {
    try {
      const lang: string | undefined = params.locale;
      const response = await api(`/questions/${questionId}/`, {}, lang);

      return {
        data: response as Question,
        message: "Successfully fetch question by ID",
        status: HttpStatusCode.OK_200,
      };
    } catch (error) {
      if (error.status === 404) {
        return {
          error: "Question not found",
          message: "Question not found",
          status: HttpStatusCode.NOT_FOUND_404,
          code: `E_${HttpStatusCode.NOT_FOUND_404}`,
        };
      } else {
        return new Yikes("E_305_INTERNAL_SERVER_ERROR").toJSON();
      }
    }
  }
);

/**
 *  @Method: POST
 *  @description: To submit question - on public access
 */
export const submitQuestion = withResponse(async (data: QuestionSubmission) => {
  const response = await api(`/questions/`, {
    method: "POST",
    body: data,
  });

  return {
    message: "Successfuly submit question",
    status: HttpStatusCode.OK_200,
  };
});

/**
 *  @Method: POST
 *  @description: To like an answer - on public access
 */
export const likeAnswer = withResponse(async (answerId: number) => {
  const ip = getIPAddress() || "0.0.0.0";

  const body = {
    actor_id: ip,
    ip_address: ip,
  };

  const response = await api(`/answers/${answerId}/like/`, {
    body: body,
    method: "POST",
  });

  return {
    message: "Successfuly like the answer",
    status: HttpStatusCode.OK_200,
  };
});

/**
 *  @Method: POST
 *  @description: To dislike an answer - on public access
 */
export const dislikeAnswer = withResponse(async (answerId: number) => {
  const ip = getIPAddress() || "0.0.0.0";

  const body = {
    actor_id: ip,
    ip_address: ip,
  };

  const response = await api(`/answers/${answerId}/dislike/`, {
    body: body,
    method: "POST",
  });

  return {
    message: "Successfuly dislike the answer",
    status: HttpStatusCode.OK_200,
  };
});
