import { getAllQuestions } from '@/actions/questionServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import SearchNavbar from '@/components/HeaderDetails/SearchNavBar';
import Footer from '@/components/FooterDetails/Footer';
import Header from '@/components/HeaderDetails/Header';
import TrendingAgencies from '@/components/TrendingAgencies';

const MainPage = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 1000;
  const { questions } = await getAllQuestions(page, pageSize);

  return (
    <div className="">
      <div className="">
        <div className="container flex justify-center mx-auto">
          <Header />
        </div>
        <SearchNavbar />

        <div className="container mt-10 flex text-out">
          <div className="max-w-screen-2xl">
            <div className="font-semibold text-base text-black-700 pb-7">
              Trending Questions
            </div>
            <QuestionBox questions={questions} />
          </div>

          <div className="pl-10 w-[500px]">
            <div className="font-semibold text-base text-black-700">
              Trending Agencies
            </div>
            <TrendingAgencies />
          </div>
        </div>

        <div className="container justify-center mx-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
