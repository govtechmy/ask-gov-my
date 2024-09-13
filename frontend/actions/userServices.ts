'use server';
import { Question, User, Topic } from '@/types/types';

const API_URL = process.env.API_URL;

// get questions by the user agency, to be used only by user.role = staff
export async function getUserAgencyQuestions(
  agencyId: number,
  page: number = 1,
  pageSize: number = 8,
  tab: string = 'all',
  searchTerm: string = '',
  date?: string,
): Promise<{
  data: {
    questions: Question[];
    total: number;
    totalPages: number;
    currentPage: number;
    unansweredCount: number;
  };
}> {
  try {
    const query = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      tab,
      search: searchTerm,
    });

    if (date) {
      query.set('date', date);
    }

    const response = await fetch(
      `${API_URL}/questions/all/by-agency/${agencyId}/?${query.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    const responseData = await response.json();

    return {
      data: {
        questions: responseData.results.results,
        total: responseData.count,
        totalPages: Math.ceil(responseData.count / pageSize),
        currentPage: page,
        unansweredCount: responseData.results.unanswered_count,
      },
    };
  } catch (error) {
    console.error('Error in getUserAgencyQuestions:', error);
    return {
      data: {
        questions: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        unansweredCount: 0,
      },
    };
  }
}

// get all questions for user.role = super_admin
export async function getAllUserQuestions(
  page: number = 1,
  pageSize: number = 10,
  tab: string = 'all',
  searchTerm: string = '',
  date: string = '',
): Promise<{
  data: {
    questions: Question[];
    total: number;
    totalPages: number;
    currentPage: number;
    unassignedCount: number;
  };
}> {
  try {
    const query = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      tab,
      search: searchTerm,
      date: date,
    });

    const response = await fetch(
      `${API_URL}/questions/all/?${query.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user questions');
    }

    const responseData = await response.json();

    return {
      data: {
        questions: responseData.results.results,
        total: responseData.count,
        totalPages: Math.ceil(responseData.count / pageSize),
        currentPage: page,
        unassignedCount: responseData.results.unassigned_count,
      },
    };
  } catch (error) {
    console.error('Error in getAllUserQuestions:', error);
    return {
      data: {
        questions: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        unassignedCount: 0,
      },
    };
  }
}

export async function submitAnswer(
  questionId: number,
  answer: string,
  attachmentUrls: string[],
): Promise<void> {
  try {
    const response = await fetch(
      `${API_URL}/questions/${questionId}/submit-answer/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            answer,
            attachments: attachmentUrls,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to submit answer: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.error('Error in submitAnswer:', error);
    throw new Error('Error submitting answer');
  }
}

export async function listUserAgencyTopics(): Promise<Topic[]> {
  const response = await fetch(`${API_URL}/topics/user-agency/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch topics');
  }

  const data = await response.json();
  return data;
}

export async function addUserAgencyTopic(
  title: string,
  title_ms: string,
): Promise<Topic> {
  const response = await fetch(`${API_URL}/topics/add/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, title_ms }),
  });

  if (!response.ok) {
    throw new Error('Failed to add topic');
  }

  const data = await response.json();
  return data;
}

export async function assignAgencyToQuestion(
  questionId: number,
  agencyId: number,
): Promise<void> {
  const response = await fetch(`${API_URL}/questions/${questionId}/agency/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ agency_id: agencyId }),
  });

  if (!response.ok) {
    throw new Error('Failed to assign agency to question');
  }
}

export async function addAgency(
  name: string,
  name_ms: string,
  acronym: string,
  logo_url: string,
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/agencies/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, name_ms, acronym, logo_url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to add agency: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.error('Error in addAgency:', error);
    throw new Error('Error adding agency');
  }
}

export async function updateAgency(
  agencyId: number,
  name: string,
  name_ms: string,
  acronym: string,
  logo_url: string,
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/agencies/${agencyId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, name_ms, acronym, logo_url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update agency: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.error('Error in updateAgency:', error);
    throw new Error('Error updating agency');
  }
}

export async function changeAdminIsOpen(questionId: number): Promise<void> {
  const response = await fetch(
    `${API_URL}/questions/${questionId}/admin_isopen/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to change admin_isopen');
  }
}

export async function changeStaffIsOpen(questionId: number): Promise<void> {
  const response = await fetch(
    `${API_URL}/questions/${questionId}/staff_isopen/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to change staff_isopen');
  }
}

export async function saveQuestionAsDraft(
  questionId: number,
  answer: string,
  attachmentUrls: string[],
): Promise<void> {
  const response = await fetch(
    `${API_URL}/questions/${questionId}/save-draft/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          answer,
          attachments: attachmentUrls,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to save question as draft');
  }
}

export async function markQuestionAsSpam(questionId: number): Promise<void> {
  const response = await fetch(
    `${API_URL}/questions/${questionId}/mark-spam/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to mark question as spam');
  }
}

export async function unSpamQuestion(questionId: number): Promise<void> {
  const response = await fetch(`${API_URL}/questions/${questionId}/un-spam/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to mark question as spam');
  }
}

export async function addUser(
  name: string,
  email: string,
  role: 'staff' | 'super_admin',
  agency: number | null,
  userProfileColour: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/admin/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, role, agency, userProfileColour }),
    });
    if (!response.ok) {
      throw new Error('Failed to add user');
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding user:', error);
    return { success: false, message: 'Failed to add user' };
  }
}

export async function editUser(
  id: string,
  name: string,
  email: string,
  role: 'staff' | 'super_admin',
  agency: number | null,
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/admin/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, role, agency }),
    });

    if (!response.ok) {
      throw new Error('Failed to edit user');
    }

    return { success: true };
  } catch (error) {
    console.error('Error editing user:', error);
    return { success: false, message: 'Failed to edit user' };
  }
}

export async function deleteUser(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/admin/user/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, message: 'Failed to delete user' };
  }
}

export async function getAllUsers({
  page = 1,
  pageSize = 12,
  tab = 'all',
  searchTerm = '',
  agencyId = '',
}: {
  page?: number;
  pageSize?: number;
  tab?: string;
  searchTerm?: string;
  agencyId?: string;
}): Promise<{
  data: { users: User[]; totalPages: number; currentPage: number };
}> {
  try {
    const response = await fetch(
      `${API_URL}/admin/users?page=${page}&page_size=${pageSize}&tab=${tab}&searchTerm=${encodeURIComponent(
        searchTerm,
      )}&agency=${agencyId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const responseData = await response.json();

    return {
      data: {
        users: responseData.results,
        totalPages: Math.ceil(responseData.count / pageSize),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      data: {
        users: [],
        totalPages: 0,
        currentPage: 1,
      },
    };
  }
}

export async function checkUserEmailExists(email: string): Promise<boolean> {
  try {
    const url = await fetch(
      `${API_URL}/admin/check-email?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!url.ok) {
      throw new Error('Failed to check email existence');
    }

    const res = await url.json();

    return res.isExists;
  } catch (error) {
    console.error('Error in checkUserEmailExists:', error);
    return false;
  }
}
