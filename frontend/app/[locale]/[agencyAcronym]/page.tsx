import {
  getAgencyList,
  getQuestionsByAgency,
} from '@/actions/questionServices';
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
    agencyAcronym: string;
    locale: string;
  };
}

const AgencyPage = async ({ params }: Props) => {
  const { agencyAcronym, locale } = params;
  const agencyUUID = AGENCY_TO_UUID[agencyAcronym.toUpperCase()];
  const { questions } = await getQuestionsByAgency(agencyUUID);
  const topics = await getTopicByAgency(parseInt(agencyUUID));
  const upperCaseAgencyAcronym = agencyAcronym.toUpperCase();

  let agencies: any = [];

  try {
    agencies = await getAgencyList();

    if (!agencies || agencies.length === 0) {
      throw new Error('Agency list is empty');
    }
  } catch {}

  const currentAgency = agencies.find(
    (agency: { acronym: string }) => agency.acronym === upperCaseAgencyAcronym,
  );

  if (currentAgency) {
  } else {
    console.log(`Agency with acronym '${agencyAcronym}' not found.`);
  }

  return (
    <div className="">
      <div className="">
        <IdentifyWebsite />
        <ContextSearchBar>
          <HeaderAgency agencyAcronym={agencyAcronym}></HeaderAgency>
          <SearchNavbarAgency
            agencyAcronym={agencyAcronym}
            agencyUUID={agencyUUID}
            currentAgency={currentAgency}
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

          <div className="pl-10 w-[500px]">
            <div className="font-semibold text-base text-black-700 pl-6 pb-7">
              <WordTranslate
                translate={'Topics'}
                keyword={'topic'}
              ></WordTranslate>
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
        <Footer></Footer>
      </div>
    </div>
  );
};

export default AgencyPage;
