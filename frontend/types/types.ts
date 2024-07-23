export interface Question {
  id: number;
  // Question id
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
  agency: number;
  //   agencyid
}
