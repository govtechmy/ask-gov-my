import { getQuestionsByAgency } from '@/actions/questionServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import { AGENCY_TO_UUID } from '@/lib/agency';
import Header from '@/components/HeaderDetails/Header';
import SearchNavbarAgency from '@/components/HeaderDetails/SearchNavBarAgency';
import Footer from '@/components/FooterDetails/Footer';
import TopicList from '@/components/TopicList';
import { getTopicByAgency } from '@/actions/questionServices';
import IdentifyWebsite from '@/components/HeaderDetails/IdentifyWebsite';
import WordTranslate from '@/components/WordTranslate';

interface Props {
  params: {
    agencyId: string;
    locale: string;
  };
  searchParams: {
    page?: string;
  };
}

const AgencyPage = async ({ params, searchParams }: Props) => {
  const { agencyId, locale } = params; //agencyId is actually agency acronym
  const agencyUUID = AGENCY_TO_UUID[agencyId.toUpperCase()];
  const { questions } = await getQuestionsByAgency(agencyUUID);
  const topics = await getTopicByAgency(parseInt(agencyUUID));

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

        <div className="bg-gradient-radial from-[#D4C0FF] to-[#F4EFFF] dark:from-[#4F1FB4] dark:to-[#201636]">
          <div className="container">
            <SearchNavbarAgency
              agencyAcronym={agencyId}
              agencyUUID={agencyUUID}
            />
          </div>
        </div>

        <div className="container mt-8 flex text-out">
          <div className="max-w-screen-2xl">
            <div className="font-semibold text-base text-black-700 pb-6">
              <WordTranslate
                translate={'Mainpage'}
                keyword={'trendingQ'}
              ></WordTranslate>
            </div>
            <QuestionBox questions={questions} />
          </div>

          <div className="pl-10 w-[500px]">
            <div className="font-semibold text-base text-black-700">
              <WordTranslate
                translate={'Topics'}
                keyword={'topic'}
              ></WordTranslate>
            </div>
            <TopicList topics={topics} locale={locale} />
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

export default AgencyPage;
