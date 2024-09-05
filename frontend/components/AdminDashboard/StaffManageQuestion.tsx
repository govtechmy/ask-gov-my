import { getUserAgencyQuestions } from '@/actions/userServices';
import StaffQuestionBox from '@/components/AdminDashboard/StaffQuestionBox';
import StaffQuestionNavbar from '@/components/AdminDashboard/StaffQuestionNavbar';
import { Question } from '@/types/types';

interface StaffManageQuestionsProps {
  searchParams: {
    page?: string;
    tab?: string;
    searchTerm?: string;
    date?: string;
  };
}

const StaffManageQuestions = async ({ searchParams }: StaffManageQuestionsProps) => {
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const searchTerm = searchParams.searchTerm || '';
  const tab = searchParams.tab || 'all';
  const date = searchParams.date || '';

  const userAgencyId = 1; // extracted from the user object in a real scenario
  // extracted from user.agency
  const { questions, totalPages, unansweredCount } = await getUserAgencyQuestions(
    userAgencyId,
    currentPage,
    8, 
    tab,
    searchTerm,
    date
  );

  return (
    <div className="container max-w-screen-lg px-6 mx-auto justify-between">
      <StaffQuestionNavbar
        unansweredCount={unansweredCount}
      />
      <div className="pt-6">
        <StaffQuestionBox questions={questions} totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
};

export default StaffManageQuestions;
