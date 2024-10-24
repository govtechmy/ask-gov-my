export interface Question {
  id: number;
  topics: number[];
  question: string;
  answer: Answer | null;
  spam: boolean;
  email: string;
  admin_opened_at: string | null;
  staff_opened_at: string | null;
  created_at: string;
  updated_at: string;
  agency: Omit<Agency, "total_likes">;
}

export interface Answer {
  id: number;
  question: number;
  raw: string;
  text: string;
  likes: number;
  draft: boolean;
  created_at: string;
  updated_at: string;
}

export interface Agency {
  id: number;
  name: string;
  name_ms: string;
  name_en: string;
  acronym: string;
  total_likes?: number;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}
export interface ESTopic {
  id: number;
  name: string;
  name_ms: string;
}

export interface Topic {
  id: number;
  title: string;
  title_ms: string;
  created_at: string;
  updated_at: string;
  agency:
    | number
    | {
        id: number;
        name: string;
        name_ms?: string;
        acronym: string;
      };
}

export interface QuestionSubmission
  extends Pick<Question, "question" | "email"> {}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "staff" | "super_admin";
  agency: Agency | null;
  user_profile_colour: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageResult<T> {
  results: T[];
  page: {
    current: number;
    max: number; // Total page
    total: number;
    limit: number;
  };
}
export interface ApiParams {
  page?: number;
  page_size?: number;
  search?: string;
}

export type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? T[K] extends object
          ? `${K}.${DeepKeys<T[K]>}`
          : K
        : never;
    }[keyof T]
  : "";
