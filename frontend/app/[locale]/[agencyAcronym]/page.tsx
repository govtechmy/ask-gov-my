import {
  getAgencyList,
  getQuestionsByAgency,
  getDynamicAgencyMap,
  getTopicByAgency,
} from '@/actions/questionServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import HeaderAgency from '@/components/HeaderDetails/HeaderAgency';
import SearchNavbarAgency from '@/components/HeaderDetails/SearchNavBarAgency';
import Footer from '@/components/FooterDetails/Footer';
import TopicList from '@/components/TopicList';
import IdentifyWebsite from '@/components/HeaderDetails/IdentifyWebsite';
import WordTranslate from '@/components/WordTranslate';
import TopicDropdown from '@/components/TopicDropdown';
import ContextSearchBar from '@/components/ContextSearchBar';

interface Props {
  params: {
    agencyAcronym: string;
    locale: string;
  };
}

const AgencyPage = async ({ params }: Props) => {
  const { agencyAcronym, locale } = params;
  const agencyMap = await getDynamicAgencyMap();
  const agencyUUID = agencyMap[agencyAcronym.toUpperCase()];
  const { questions, totalItems, totalPages, currentPage } =
    await getQuestionsByAgency(agencyUUID);
  const topics = await getTopicByAgency(parseInt(agencyUUID));
  const upperCaseAgencyAcronym = agencyAcronym.toUpperCase();

  let agencyList: any = [];

  try {
    agencyList = await getAgencyList();

    if (!agencyList || agencyList.length === 0) {
      throw new Error('Agency list is empty');
    }
  } catch {}

  const currentAgency = agencyList.find(
    (agency: { acronym: string }) => agency.acronym === upperCaseAgencyAcronym,
  );

  if (!currentAgency) {
    console.log(`Agency with acronym '${agencyAcronym}' not found.`);
  }

  return (
    <div>
      <IdentifyWebsite />
      <ContextSearchBar>
        <HeaderAgency agencyAcronym={agencyAcronym} />
        <SearchNavbarAgency
          agencyAcronym={agencyAcronym}
          agencyUUID={agencyUUID}
          currentAgency={currentAgency}
        />
      </ContextSearchBar>

      <div className="container mt-8 flex">
        <div className="max-w-screen-2xl">
          <div className="font-semibold text-base text-black-700 pb-6">
            <WordTranslate translate={'Mainpage'} keyword={'trendingQ'} />
          </div>
          <QuestionBox
            questions={questions}
            agencyMap={agencyMap}
            agencyList={agencyList}
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={currentPage}
            importFunction={getQuestionsByAgency}
            value={currentAgency.id}
          />
        </div>

        <div className="pl-10 w-[500px]">
          <div className="font-semibold text-base text-black-700 pl-6 pb-7">
            <WordTranslate translate={'Topics'} keyword={'topic'} />
          </div>

          <div className="hidden md:block">
            <TopicList
              topics={topics}
              locale={locale}
              agencyAcronym={agencyAcronym}
            />
          </div>

          <div className="md:invisible">
            <TopicDropdown
              topics={topics}
              locale={locale}
              agencyAcronym={agencyAcronym}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AgencyPage;
