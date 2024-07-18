import { getQuestionsByAgency } from '@/actions/questionServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import { AGENCY_TO_UUID } from '@/lib/agency';
import HeaderAgency from '@/components/HeaderDetails/HeaderAgency';
import SearchNavbarAgency from '@/components/HeaderDetails/SearchNavBarAgency';
import Footer from '@/components/FooterDetails/Footer';
import TopicList from '@/components/TopicList';
import { getTopicByAgency } from '@/actions/questionServices';
import IdentifyWebsite from '@/components/HeaderDetails/IdentifyWebsite';
import WordTranslate from '@/components/WordTranslate';
import TopicDropdown from '@/components/TopicDropdown';
import ContextSearchBar from '@/components/ContextSearchBar';

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
        <IdentifyWebsite />
        <ContextSearchBar>
          <HeaderAgency></HeaderAgency>
          <SearchNavbarAgency
            agencyAcronym={agencyId}
            agencyUUID={agencyUUID}
          />
        </ContextSearchBar>

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

          {/* make this sticky */}
          {/* remove when size is large than some px display small one. */}
          {/* home change language */}
          <div className="pl-10 w-[500px]">
            <div className="font-semibold text-base text-black-700 pl-6 pb-7">
              <WordTranslate
                translate={'Topics'}
                keyword={'topic'}
              ></WordTranslate>
            </div>

            <div className="hidden md:block">
              <TopicList topics={topics} locale={locale} agencyId={agencyId} />
            </div>

            <div className="md:invisible">
              <TopicDropdown
                topics={topics}
                locale={locale}
                agencyId={agencyId}
              />
            </div>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default AgencyPage;
