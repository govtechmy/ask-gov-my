import api from "@/lib/api";
import { Agency } from "@/types/types";
import { HttpStatusCode, withResponse } from "@askgovmy/utils";

/**
 *  @Method: GET
 *  @Response: List of all questions
 */
export const getAgencyList = withResponse(
  async (params?: Record<string, any>) => {
    const lang: string | undefined = params && params.locale;
    const response = await api(`/agencies/`, {}, lang);
    return {
      data: response as Agency[],
      message: "Successfully fetch agencies list",
      status: HttpStatusCode.OK_200,
    };
  }
);
