export interface Question {
  id: number;
  topics: number[] | ESTopic[];
  question: string;
  answer: Answer;
  spam: boolean;
  email: string;
  admin_opened_at: string | null;
  staff_opened_at: string | null;
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
  acronym: string;
  total_likes: number;
  logo_url?: string;
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
  name: string | null;
  email: string;
  image: string | null;
  role: "staff" | "super_admin";
  agency: number | null;
  user_profile_colour: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageResult<T> {
  results: T[];
  count: number;
  next: string;
  previous: string;
}
