import axios, { AxiosResponse } from "axios";

// Request options type for the API wrapper
type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number>;
  timeout?: number; // Timeout in milliseconds
};

// Create an axios instance
const base = axios.create({
  baseURL: process.env.API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Reusable API wrapper function
const api = async (url: string, options: RequestOptions = {}): Promise<any> => {
  const {
    method = "GET",
    headers = {},
    body,
    params,
    timeout = 5000,
  } = options;

  try {
    const response = await base.request({
      url,
      method,
      headers: { ...headers },
      data: body,
      params,
      timeout,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
