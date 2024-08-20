export interface Question {
  id: number;
  topics: number[];
  question: string;
  date: string;
  state: string;
  answer: string;
  email?: string;
  likes: number;
  dislikes: number;
  attachments?: string[];
  answered_date: string;
  admin_isopen?: boolean;
  staff_isopen?: boolean;
  agency:
    | number
    | {
        id: number;
        name: string;
        name_ms?: string;
        acronym: string;
      };
  answer_preview: string;
}

export interface Agency {
  id: number;
  name: string;
  name_ms: string;
  acronym: string;
  total_likes?: number;
  logo_url?: string;
  last_edited: Date;
}

export interface Topic {
  title_ms: string;
  id: number;
  title: string;
  agency: {
    id: number;
    name: string;
    acronym: string;
  };
}

export interface QuestionSubmission {
  question: string;
  email: string;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: 'staff' | 'super_admin';
  createdAt: Date;
  updatedAt: Date;
  agency: number | null;
}
