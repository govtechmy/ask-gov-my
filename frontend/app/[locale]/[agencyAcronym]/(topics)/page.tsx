import {
  getAgencyList,
  getQuestionsByAgency,
  getDynamicAgencyMap,
  getTopicByAgency,
} from '@/actions/questionServices';
import QuestionBox from '@/components/common/QuestionBox/QuestionBox';
import Footer from '@/components/common/Footer';
import TopicList from '@/components/common/TopicList';
import WordTranslate from '@/components/common/WordTranslate';
import TopicDropdown from '@/components/common/TopicDropdown';
import ContextSearchBar from '@/components/context/ContextSearchBar';
import BaseHeader from '@/components/common/Header/BaseHeader';
import SearchNavbar from '@/components/common/SearchNavbar/SearchNavbar';
import Masthead from '@/components/common/Header/Masthead';

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
  const { questions } = await getQuestionsByAgency(agencyUUID);
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
      <div className="container mt-8 flex">
        <div className="max-w-screen-2xl">
          <div className="font-semibold text-base text-black-700 pb-6">
            <WordTranslate translate={'Mainpage'} keyword={'trendingQ'} />
          </div>
          <QuestionBox
            questions={questions}
            agencyMap={agencyMap}
            agencyList={agencyList}
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
