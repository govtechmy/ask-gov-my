"use server";
const API_URL = process.env.API_URL;
import { paginate } from "@/lib/server-helper";
import {
  Question,
  Agency,
  Topic,
  QuestionSubmission,
  PageResult,
} from "@/types/types";

export async function getAllQuestions(
  page: number = 1,
  limit: number = 6,
  agencyId?: number,
  topicId?: number
): Promise<PageResult<Question>> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: limit.toString(),
    });

    if (agencyId) {
      params.append("agency", agencyId.toString());
    }
    if (topicId) {
      params.append("topics", topicId.toString());
    }

    const response = await fetch(`${API_URL}/questions/?${params.toString()}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();

    return paginate(data.results, data.count, page, limit);
  } catch (error) {
    console.error("Error in getAllQuestions:", error);
    return {
      results: [],
      page: {
        current: 1,
        max: 0,
        total: 0,
        limit: 0,
      },
    };
  }
}

// Search questions endpoint via ES
export async function searchQuestions(
  query: string = "",
  page: number = 1,
  limit: number = 10
): Promise<PageResult<Question>> {
  try {
    const params = new URLSearchParams({
      q: query,
      // TODO: Add this when endpoint is fixed.
      // page: page.toString(),
      // page_size: limit.toString(),
    });
    const response = await fetch(
      `${API_URL}/questions/search/?${params.toString()}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();

    return paginate(data.results, data.count, page, limit);
  } catch (error) {
    console.error("Error in searchQuestions:", error);
    return {
      results: [],
      page: {
        current: 1,
        max: 0,
        total: 0,
        limit: 0,
      },
    };
  }
}

export async function getAllTopics(agencyId?: number): Promise<Topic[]> {
  const params = new URLSearchParams();
  if (agencyId) {
    params.append("agency", agencyId.toString());
  }
  const response = await fetch(`${API_URL}/topics/?${params.toString()}`, {
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch topics");
  }

  const data = await response.json();
  return data;
}

export async function getTopicsDetail(
  topicIds: number[],
  agencyId: number,
  locale: string
): Promise<string[]> {
  const topics = await getAllTopics(agencyId);
  const topicIdToTitleMap: { [key: number]: string } = {};

  if (locale === "en-GB") {
    topics.forEach((topic) => {
      topicIdToTitleMap[topic.id] = topic.title;
    });
  } else {
    topics.forEach((topic) => {
      topicIdToTitleMap[topic.id] = topic.title_ms;
    });
  }

  return topicIds.map((id) => topicIdToTitleMap[id] || "Unknown Topic");
}

export async function getQuestionsByAgency(
  agencyId: string,
  page: number = 1,
  pageSize: number = 6
): Promise<{
  data: Question[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}> {
  try {
    const response = await fetch(
      `${API_URL}/questions?agency=${agencyId}&page=${page}&page_size=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();

    return {
      data: data.results,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / pageSize),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error in getQuestionsByAgency:", error);
    return {
      data: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
}

export async function getQuestionsByTopicAndAgency(
  agencyUUID: string,
  topicId: string,
  page: number = 1,
  pageSize: number = 6
): Promise<{
  data: Question[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}> {
  try {
    const response = await fetch(
      `${API_URL}/questions?agency=${agencyUUID}&topics=${topicId}&page=${page}&page_size=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();

    return {
      data: data.results,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / pageSize),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching questions:", error);
    return {
      data: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
}

export async function getQuestionById(
  questionId: string
): Promise<Question | { code: number }> {
  const response = await fetch(`${API_URL}/questions/${questionId}/`, {
    method: "GET",
    next: { revalidate: 0 },
  });
  if (response.ok) {
    return response.json();
  }
  return {
    code: response.status,
  };
}

export async function submitQuestion(data: QuestionSubmission): Promise<void> {
  const url = `${API_URL}/submit-question/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      let errorMessage = `Failed to submit question. Status: ${response.status}`;

      // error message from response body
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage += ` - ${errorData.message}`;
        }
      } catch (e) {
        // ignore JSON parsing errors and keep the original error message
      }

      throw new Error(errorMessage);
    }

    // return response data
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Network error: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export async function getAgencyList(): Promise<Agency[]> {
  try {
    const response = await fetch(`${API_URL}/agencies`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch agency list");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getAgencyList:", error);
    return [];
  }
}

export async function getAgency(agencyId: number): Promise<Agency | null> {
  try {
    const agencies = await getAgencyList();
    const agency = agencies.find((agency) => agency.id === agencyId);

    if (!agency) {
      throw new Error(`Agency with ID ${agencyId} not found`);
    }

    return agency;
  } catch (error) {
    console.error("Error in getAgency:", error);
    return null;
  }
}

export async function getAgencyListWithPagination(
  page: number = 1,
  pageSize: number = 27,
  searchTerm: string = ""
): Promise<{
  data: {
    agencies: Agency[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}> {
  try {
    const searchQuery = searchTerm
      ? `&search=${encodeURIComponent(searchTerm)}`
      : "";
    const response = await fetch(
      `${API_URL}/agencies?page=${page}&page_size=${pageSize}${searchQuery}`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch agency list");
    }

    const responseData = await response.json();

    return {
      data: {
        agencies: responseData.results.map((agency: Agency) => ({
          id: agency.id,
          name: agency.name,
          name_ms: agency.name_ms,
          acronym: agency.acronym,
          logo_url: agency.logo_url,
          last_edited: agency.updated_at,
        })),
        totalItems: responseData.totalItems,
        totalPages: Math.ceil(responseData.count / pageSize),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Error in getAgencyListWithPagination:", error);
    return {
      data: {
        agencies: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
      },
    };
  }
}

export async function getDynamicAgencyMap(): Promise<Record<string, string>> {
  try {
    const response = await fetch(`${API_URL}/agencies`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch agency list");
    }

    const data: Agency[] = await response.json();
    const agencyMap: Record<string, string> = {};

    data.forEach((agency) => {
      if (agency.acronym) {
        agencyMap[agency.acronym] = agency.id.toString();
      }
    });

    return agencyMap;
  } catch (error) {
    console.error("Error in getDynamicAgencyMap:", error);
    return {};
  }
}

export async function likeQuestion(questionId: string): Promise<void> {
  const url = `${API_URL}/questions/${questionId}/like/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to like question");
  }
}

export async function dislikeQuestion(questionId: string): Promise<void> {
  const url = `${API_URL}/questions/${questionId}/dislike/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to dislike question");
  }
}

export async function getTrendingAgencies(): Promise<Agency[]> {
  try {
    const response = await fetch(`${API_URL}/agencies/`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch trending agencies");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getTrendingAgencies:", error);
    return [];
  }
}
