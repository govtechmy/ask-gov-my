import { getTrendingAgencies } from '@/actions/questionServices';
import { searchQuestions } from '@/actions/searchServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import SearchNavbar from '@/components/HeaderDetails/SearchNavBar';
import Footer from '@/components/FooterDetails/Footer';
import Header from '@/components/HeaderDetails/Header';
import TrendingAgencies from '@/components/TrendingAgencies';
import IdentifyWebsite from '@/components/HeaderDetails/IdentifyWebsite';
import WordTranslate from '@/components/WordTranslate';

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
      <IdentifyWebsite></IdentifyWebsite>
      <Header></Header>
      <SearchNavbar />

      <div className="container mt-10 flex text-out">
        <div className="max-w-screen-2xl">
          <div className="font-semibold text-base text-black-700 pb-7 flex">
            {questions.length}&nbsp;
            <div>
              <WordTranslate
                translate={'Search'}
                keyword={'search_result'}
              ></WordTranslate>
            </div>
            <div>&nbsp;"{query}"</div>
          </div>
          <QuestionBox questions={questions} />
        </div>

        <div className="pl-10 w-[500px]">
          <div className="font-semibold text-base text-black-700">
            <WordTranslate
              translate={'Mainpage'}
              keyword={'trendingA'}
            ></WordTranslate>
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
  );
};

export default SearchResultPage;
