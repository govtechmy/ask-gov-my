import {
  getAgencyList,
  getQuestionsByAgency,
  getTopicByAgency,
  getDynamicAgencyMap,
} from '@/actions/questionServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import Footer from '@/components/Footer';
import IdentifyWebsite from '@/components/HeaderDetails/IdentifyWebsite';
import TopicList from '@/components/TopicList';
import SearchNavbarAgency from '@/components/HeaderDetails/SearchNavBarAgency';
import TopicDropdown from '@/components/TopicDropdown';
import WordTranslate from '@/components/WordTranslate';
import HeaderAgency from '@/components/HeaderDetails/HeaderAgency';
import ContextSearchBar from '@/components/ContextSearchBar';

interface Props {
  params: {
    agencyAcronym: string;
    topicId: string;
    locale: string;
  };
}

const TopicPage = async ({ params }: Props) => {
  const { agencyAcronym, topicId, locale } = params;
  const agencyMap = await getDynamicAgencyMap();
  const agencyUUID = agencyMap[agencyAcronym.toUpperCase()];

  const { questions } = await getQuestionsByAgency(agencyUUID);
  const filteredQuestions = questions.filter(question =>
    question.topics.includes(parseInt(topicId, 10)),
  );

  const topics = await getTopicByAgency(parseInt(agencyUUID, 10));
  const selectedTopic = topics.find(
    topic => topic.id === parseInt(topicId, 10),
  );

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
      <IdentifyWebsite></IdentifyWebsite>

      <ContextSearchBar>
        <HeaderAgency agencyAcronym={agencyAcronym}></HeaderAgency>
        <SearchNavbarAgency
          agencyAcronym={agencyAcronym}
          agencyUUID={agencyUUID}
          currentAgency={currentAgency}
        />
      </ContextSearchBar>

      <div className="container mt-10 flex text-out">
        <div className="max-w-screen-2xl">
          <div className="font-medium text-base text-black-700 pb-7 flex items-center">
            <div className="pr-1">
              <div className="flex">
                <WordTranslate
                  translate={'Topics'}
                  keyword={'showing'}
                ></WordTranslate>
                &nbsp;
                {filteredQuestions.length}
                &nbsp;
                <WordTranslate
                  translate={'Topics'}
                  keyword={'questionsin'}
                ></WordTranslate>
                &nbsp;
              </div>
            </div>
            <div className="bg-askmygovbrand-50 border-[1px] border-askmygovbrand-200 h-8 items-center flex px-2 rounded-md text-askmygovtextbrand-600">
              {locale === 'ms' ? selectedTopic?.title_ms : selectedTopic?.title}
            </div>
          </div>
          {filteredQuestions.length > 0 ? (
            <QuestionBox
              questions={filteredQuestions}
              agencyMap={agencyMap}
              agencyList={agencyList}
            />
          ) : (
            <div className=" h-[220px] w-[900px]">
              <div className="text-dim-500">
                <WordTranslate
                  translate={'Topics'}
                  keyword={'notfound'}
                ></WordTranslate>
              </div>
            </div>
          )}
        </div>

        <div className="pl-10 w-[500px]">
          <div className="font-semibold text-base text-black-700 pl-6 pb-8">
            <WordTranslate
              translate={'Topics'}
              keyword={'topic'}
            ></WordTranslate>
          </div>
          <div className="font-semibold text-base text-black-700 h-[500px]">
            <div className="hidden md:block">
              <TopicList
                topics={topics}
                locale={locale}
                selectedTopicId={parseInt(topicId)}
                agencyAcronym={agencyAcronym}
              />
            </div>

            <div className="md:invisible">
              <TopicDropdown
                topics={topics}
                locale={locale}
                selectedTopicId={parseInt(topicId)}
                agencyAcronym={agencyAcronym}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TopicPage;
