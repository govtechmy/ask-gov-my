import {
  getQuestionById,
  getTopicsDetail,
  getTopicByAgency,
  getAgencyList,
  getDynamicAgencyMap,
} from '@/actions/questionServices';
import { getRelatedQuestions } from '@/actions/searchServices';
import Footer from '@/components/common/Footer';
import RelatedTopics from '@/components/QuestionDetailPage/RelatedTopics';
import RightArrow from '@/icons/rightarrow';
import IconQuestionSmileSolo from '@/icons/iconquestionsmilesolo';
import ThumbsCounter from '@/components/QuestionDetailPage/ThumbsCounter';
import AgencyName from '@/components/common/AgencyName';
import JataNegaraIcon from '@/icons/jatanegaraicon';
import { redirect } from 'next/navigation';
import DateComponent from '@/components/common/Date';
import Link from 'next/link';
import WordTranslate from '@/components/common/WordTranslate';
import { Question } from '@/types/types';
import AgencyLogoImporter from '@/components/common/AgencyLogoImporter';
import ContextSearchBar from '@/components/context/ContextSearchBar';
import { fetchFileSizes } from '@/actions/utils';
import AttachmentDownload from '@/components/AdminDashboard/AttachmentDownload';
import TipTap from '@/components/Editor/TipTap';
import BaseHeader from '@/components/common/Header/BaseHeader';
import Masthead from '@/components/common/Header/Masthead';
import { StyledDisplay } from '@/components/ui/display';

interface Props {
  params: {
    agencyAcronym: string;
    questionId: string;
    locale: string;
  };
  question?: Question;
}

const QuestionDetailPage: React.FC<Props> = async ({ params }) => {
  const { locale, agencyAcronym, questionId } = params;
  const AGENCY_TO_UUID = await getDynamicAgencyMap();
  const agencyUUID = parseInt(AGENCY_TO_UUID[agencyAcronym.toUpperCase()]);
  const topics = await getTopicByAgency(agencyUUID);

  const agencyAcronymObject = (id: number): string | undefined => {
    return Object.keys(AGENCY_TO_UUID).find(
      key => AGENCY_TO_UUID[key] === id.toString(),
    );
  };

  let question: Question | null = null;
  let topicTitles: Array<any> = [];

  try {
    question = await getQuestionById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    topicTitles = await getTopicsDetail(question.topics, locale);
  } catch (error) {
    redirect('/');
  }

  const attachments = question.attachments || [];

  let fileSize: number[] = [];

  try {
    fileSize = await fetchFileSizes(attachments);
  } catch (error) {
    console.log('error on fileSize', error);
  }

  let agencyList: any = [];

  try {
    agencyList = await getAgencyList();

    if (!agencyList || agencyList.length === 0) {
      throw new Error('Agency list is empty');
    }
  } catch {}

  const currentAgency = agencyList.find(
    (agency: { acronym: string }) =>
      agency.acronym === agencyAcronym.toUpperCase(),
  );

  const relatedQuestions = await getRelatedQuestions(question.question);

  return (
    <div>
      <ContextSearchBar>
        <BaseHeader alwaysShowInput={true}></BaseHeader>
      </ContextSearchBar>

      <div className="container mt-10 flex">
        <div className="max-w-screen-2xl flex">
          <div className="pb-7 w-9/12">
            <div className="flex items-center gap-1">
              <Link href={'/'}>
                <div className="font-medium text-dim-500 text-sm">
                  <WordTranslate
                    translate={'Questiondetail'}
                    keyword={'home'}
                  />
                </div>
              </Link>
              <div>
                <RightArrow />
              </div>
              <div className="font-medium text-black-800 text-sm">
                {currentAgency.acronym}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div>
                <IconQuestionSmileSolo />
              </div>
              <div className="text-black-700 flex text-base font-medium">
                <div>
                  <WordTranslate
                    translate={'Questiondetail'}
                    keyword={'posted'}
                  />
                </div>
                &nbsp;
                <DateComponent date={question.date} locale={locale} />
              </div>
            </div>

            <div className="py-6 text-[#1D4ED8] dark:text-[#588BFB] font-medium text-2xl">
              {question.question}
            </div>

            <div className="pb-6 max-w-[932px]">
              <div className="bg-[#FFFFFF] dark:bg-[#1D1D21] border-[1px] border-outline-200 rounded-lg ">
                <div>
                  <div className="">
                    <div className="flex px-8 pt-8 pb-0 items-center">
                      <div className="flex w-6 h-6 relative flex-shrink-0">
                        <AgencyLogoImporter currentAgency={currentAgency} />
                      </div>
                      <div className="font-medium text-sm text-black-700 px-2">
                        <AgencyName agency={currentAgency} />
                      </div>
                      <div className="font-medium text-sm text-dim-500">
                        <WordTranslate
                          translate={'Questiondetail'}
                          keyword={'answered'}
                        />
                      </div>
                    </div>
                    <div className="flex px-8 pb-5 pt-4 text-justify text-black-700 flex-col">
                      <TipTap
                        editorText={question.answer}
                        className="w-full flex-1"
                        isEditable={false}
                        hasMenuBar={false}
                      />
                    </div>

                    <div className="px-8 pb-8 pt-0">
                      <div className="flex gap-3 items-center border-b-[1px] border-outline-200 pb-[22px]">
                        <div className=" font-medium text-sm">Topics: </div>
                        <div className="flex gap-[6px]">
                          {topicTitles.map((TopicTitles, index) => (
                            <StyledDisplay key={index} variant={'Topics'}>
                              {TopicTitles}
                            </StyledDisplay>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="px-8 pb-8 pt-0">
                      <WordTranslate
                        translate={'Questiondetail'}
                        keyword={'attachment'}
                      />
                    </div>
                    <div className="mx-8 mb-8 ">
                      <AttachmentDownload
                        uploadedAttachments={attachments}
                        fileSizes={fileSize}
                      ></AttachmentDownload>
                    </div>
                  </div>
                  <div>
                    <ThumbsCounter
                      questionId={questionId}
                      totalLikes={question.likes}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-base pt-6 pb-2">
                  Related questions
                </div>
                <div>
                  {relatedQuestions.map((relatedQuestion, index) => (
                    <div
                      key={index}
                      className="flex rounded-md items-center pr-2 pl-4 py-2 last:border-0 hover:bg-outline-200 max-h-[76px] max-w-[780px]"
                    >
                      <Link
                        className="grow"
                        href={`/${relatedQuestion.agency.acronym.toLowerCase()}/${relatedQuestion.id}`}
                      >
                        <span className="font-medium text-sm text-black-700 line-clamp-1">
                          {relatedQuestion.question}
                        </span>
                        <span className="mt-1 font-normal text-sm text-dim-500 line-clamp-1">
                          Answer: {relatedQuestion.answer}
                        </span>
                      </Link>
                      <span className="on hover:cursor-pointer pl-3">
                        <div className="flex">
                          <div className="pr-1.5">
                            <JataNegaraIcon className="stroke-[#E4E4E7] dark:stroke-[#27272A] h-5 w-5" />
                          </div>
                          <div className="font-normal text-sm text-black-800">
                            {agencyAcronymObject(relatedQuestion.agency.id)}
                          </div>
                          <div className="px-1">
                            <RightArrow />
                          </div>
                        </div>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="font-semibold text-base text-black-700 pl-10 w-3/12">
            <RelatedTopics
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

export default QuestionDetailPage;
