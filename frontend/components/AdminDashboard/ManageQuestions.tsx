import { getAllUserQuestions } from '@/actions/userServices';
import { getAgencyList, getDynamicAgencyMap } from '@/actions/questionServices';
import AdminQuestionBox from '@/components/AdminDashboard/AdminQuestionBox';
import QuestionNavbar from '@/components/AdminDashboard/QuestionNavbar';
import { Question, Agency } from '@/types/types';

interface ManageQuestionsProps {
  searchParams: {
    page?: string;
    tab?: string;
    searchTerm?: string;
  };
}

const ManageQuestions = async ({ searchParams }: ManageQuestionsProps) => {
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const searchTerm = searchParams.searchTerm || '';
  const tab = searchParams.tab || 'all';

  const { questions, totalPages } = await getAllUserQuestions(currentPage, 10, tab, searchTerm);
  const agencyList = await getAgencyList();
  const agencyMap = await getDynamicAgencyMap();

  return (
    <div className="container max-w-screen-lg mx-auto justify-between px-6">
      <QuestionNavbar
        unassignedCount={199}
        currentTab={tab}
        searchTerm={searchTerm}
      />
      <div className="pt-6">
        <AdminQuestionBox
          questions={questions}
          totalPages={totalPages}
          currentPage={currentPage}
          agencyMap={agencyMap}
          agencies={agencyList}
        />
      </div>
    </div>
  );
};

export default ManageQuestions;
