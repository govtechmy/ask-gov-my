import { getAllQuestions, getTrendingAgencies } from '@/actions/questionServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import SearchNavbar from '@/components/HeaderDetails/SearchNavBar';
import Footer from '@/components/FooterDetails/Footer';
import Header from '@/components/HeaderDetails/Header';
import TrendingAgencies from '@/components/TrendingAgencies';
import IdentifyWebsite from '@/components/HeaderDetails/IdentifyWebsite';

const MainPage = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 1000;
  const { questions } = await getAllQuestions(page, pageSize);
  const trendingAgencies = await getTrendingAgencies();


  async function submitactions(params: FormData) {
    'use server';
    console.log('Hello');
  }

  return (
    <div className="">
      <div className="">
        <div className="sticky top-0 z-10 bg-white border-b-[1px]">
          <div className="container">
            <IdentifyWebsite />
          </div>
        </div>
        <div className="bg-white">
          <div className="container flex justify-center mx-auto bg-black-700">
            <Header />
          </div>
        </div>

        <form action={submitactions}>
          <SearchNavbar />
        </form>

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
            <TrendingAgencies agencies={trendingAgencies} />
          </div>
        </div>

        <div className="bg-white border-t">
          <div className="container justify-center mx-auto">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
