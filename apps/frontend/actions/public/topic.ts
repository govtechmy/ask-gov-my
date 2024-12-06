"use server";
import api from "@/lib/api";
import { Topic } from "@/types/types";
import { HttpStatusCode, withResponse } from "@askgovmy/utils";

/**
 *  @Method: GET
 *  @Response: List of all topic in an agency
 */
export const getAllTopics = withResponse(
  async ({ agencyId }: { agencyId?: number }, params: Record<string, any>) => {
    const lang: string | undefined = params.locale;
    const response = await api(
      `/topics/`,
      {
        params: {
          ...(agencyId && { agency: agencyId }),
        },
      },
      lang
    );
    return {
      data: response as Topic[],
      message: "Successfully fetch question list",
      status: HttpStatusCode.OK_200,
    };
  }
);
