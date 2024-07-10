import { getTrendingAgencies } from '@/actions/questionServices';
import { searchQuestions } from '@/actions/searchServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import SearchNavbar from '@/components/HeaderDetails/SearchNavBar';
import Footer from '@/components/FooterDetails/Footer';
import Header from '@/components/HeaderDetails/Header';
import TrendingAgencies from '@/components/TrendingAgencies';
import IdentifyWebsite from '@/components/HeaderDetails/IdentifyWebsite';

const SearchResultPage = async ({
  searchParams,
}: {
  searchParams: { query?: string };
}) => {
  const query = searchParams.query || '';
  const questions = await searchQuestions(query);
  const trendingAgencies = await getTrendingAgencies();
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

        <SearchNavbar />

        <div className="container mt-10 flex text-out">
          <div className="max-w-screen-2xl">
            <div className="font-semibold text-base text-black-700 pb-7 flex">
              <div>{questions.length} search results for &nbsp;</div>
              <div>{query}</div>
            </div>
            <QuestionBox questions={questions} />
          </div>

          <div className="pl-10 w-[500px]">
            <div className="font-semibold text-base text-black-700">
              Relevant Agencies
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

export default SearchResultPage;
