"use server";
const API_URL = process.env.API_URL;
import { getIPAddress, paginate } from "@/lib/server-helper";
import {
  Question,
  Agency,
  Topic,
  QuestionSubmission,
  PageResult,
} from "@/types/types";

// TODO: Remove when fully ready
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

export async function likeAnswer(answerId: number): Promise<void> {
  const url = `${API_URL}/answers/${answerId}/like/`;
  const ip = getIPAddress() || "0.0.0.0";

  const body = {
    actor_id: ip,
    ip_address: ip,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error("Failed to like answer", {
      answerId,
      request: {
        body,
      },
      response: {
        status: response.status,
        body: await response.json(),
      },
    });
    throw new Error("Failed to like answer");
  }
}

export async function dislikeAnswer(answerId: number): Promise<void> {
  const url = `${API_URL}/answers/${answerId}/dislike/`;
  const ip = getIPAddress() || "0.0.0.0";

  const body = {
    actor_id: ip,
    ip_address: ip,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error("Failed to dislike answer", {
      answerId,
      request: {
        body,
      },
      response: {
        status: response.status,
        body: await response.json(),
      },
    });
    throw new Error("Failed to dislike answer");
  }
}
