import { getTrendingAgencies, getDynamicAgencyMap, getAgencyList } from '@/actions/questionServices';
import { searchQuestions } from '@/actions/searchServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import SearchNavbar from '@/components/HeaderDetails/SearchNavBar';
import Footer from '@/components/FooterDetails/Footer';
import Header from '@/components/HeaderDetails/Header';
import TrendingAgencies from '@/components/TrendingAgencies';
import IdentifyWebsite from '@/components/HeaderDetails/IdentifyWebsite';
import WordTranslate from '@/components/WordTranslate';
import ContextSearchBar from '@/components/ContextSearchBar';

const SearchResultPage = async ({
  searchParams,
}: {
  searchParams: { query?: string };
}) => {
  const query = searchParams.query || '';
  const questions = await searchQuestions(query);
  const trendingAgencies = await getTrendingAgencies();
  const agencyMap = await getDynamicAgencyMap();
  const agencyList = await getAgencyList()
  return (
    <div>
      <IdentifyWebsite />

      <ContextSearchBar>
        <Header />
        <SearchNavbar />
      </ContextSearchBar>

      <div className="container mt-10 flex">
        <div className="max-w-screen-2xl">
          <div className="font-semibold text-base text-black-700 pb-7 flex">
            {questions.length}&nbsp;
            <div>
              <WordTranslate translate={'Search'} keyword={'search_result'} />
            </div>
            <div>&nbsp;"{query}"</div>
          </div>
          {questions.length > 0 ? (
            <QuestionBox questions={questions} agencyMap={agencyMap} agencyList={agencyList}/>
          ) : (
            <div className=" h-[220px] w-[900px] text-dim-500">
              <WordTranslate
                translate={'Search'}
                keyword={'answernotfound'}
              ></WordTranslate>
            </div>
          )}
        </div>

        <div className="pl-10 w-[500px]">
          <div className="font-semibold text-base text-black-700">
            <WordTranslate translate={'Mainpage'} keyword={'trendingA'} />
          </div>
          <TrendingAgencies trendingAgencies={trendingAgencies} />
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default SearchResultPage;
