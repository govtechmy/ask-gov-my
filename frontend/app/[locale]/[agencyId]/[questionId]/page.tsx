import {
  getQuestionById,
  getTopicsDetail,
  getTopicByAgency,
} from '@/actions/questionServices';
import Header from '@/components/HeaderDetails/Header';
import Footer from '@/components/FooterDetails/Footer';
import RelatedTopics from '@/components/RelatedTopics';
import RightArrow from '@/icons/rightarrow';
import IconQuestionSmileSolo from '@/icons/iconquestionsmilesolo';
import ThumbsCounter from '@/components/ThumbsCounter';
import AgencyName from '@/components/AgencyName';
import JataNegaraIcon from '@/icons/jatanegaraicon';
import Pdf from '@/icons/pdf';
import { AGENCY_TO_UUID } from '@/lib/agency';
import { redirect } from 'next/navigation';
import DateComponent from '@/components/date';
import Link from 'next/link';
import IdentifyWebsite from '@/components/HeaderDetails/IdentifyWebsite';
import WordTranslate from '@/components/WordTranslate';
import SupportingAttachment from '@/components/SupportingAttachment';

interface Props {
  params: {
    agencyId: string;
    questionId: string;
    locale: string;
  };
  question?: Question;
}

interface Question {
  id: number;
  question: string;
  date: string;
  state: string;
  agency: number;
  answer: string;
  topics: number[];
  email: string;
  likes: number;
  dislikes: number;
  attachments: string[];
  isopen: boolean;
}

const QuestionDetailPage: React.FC<Props> = async ({ params }) => {
  const { locale, agencyId, questionId } = params;
  const agencyUUID = parseInt(AGENCY_TO_UUID[agencyId.toUpperCase()]);
  const topics = await getTopicByAgency(agencyUUID);
  const agencyAcronym = (id: number): string | undefined => {
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
  const attachments = question.attachments;
  const acronym = agencyAcronym(question.agency);

  return (
    <div className="">
      <IdentifyWebsite></IdentifyWebsite>
      <Header></Header>

      <div className="container mt-10 flex text-out">
        <div className="max-w-screen-2xl flex">
          <div className="pb-7 w-9/12">
            <div className="flex items-center gap-1">
              <Link href={'/'}>
                <div className="font-medium text-dim-500 text-sm">Home</div>
              </Link>
              <div>
                <RightArrow />
              </div>
              <div className="font-medium text-black-800 text-sm">
                {acronym}
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
                  ></WordTranslate>
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
                      <div className="w-6 h-6">
                        <JataNegaraIcon className="stroke-[#E4E4E7] dark:stroke-[#27272A]" />
                      </div>
                      <div className="font-medium text-sm text-black-700 px-2">
                        <AgencyName acronym={acronym} />
                      </div>
                      <div className="font-medium text-sm text-dim-500">
                        <WordTranslate
                          translate={'Questiondetail'}
                          keyword={'answered'}
                        ></WordTranslate>
                      </div>
                    </div>
                    <div className="flex px-8 pb-5 pt-4 text-justify text-black-700">
                      {question.answer}
                    </div>

                    <div className="px-8 pb-8 pt-0">
                      <div className="flex gap-3 items-center border-b-[1px] border-outline-200 pb-[22px]">
                        <div className=" font-medium text-sm">Topics: </div>
                        <div className="flex gap-[6px]">
                          {topicTitles.map((TopicTitles, index) => (
                            <div
                              className="flex text-base font-medium text-[#702FF9] dark:text-[#9E70FF] bg-[#F4EFFF] dark:bg-[#201636] border-[1px] border-[#D4C0FF] dark:border-[#4F1FB4] px-2 py-1 rounded-lg"
                              key={index}
                            >
                              {TopicTitles}
                            </div>
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
                      ></WordTranslate>
                    </div>
                    <div className="px-8 pb-8 pt-0 ">
                      <SupportingAttachment
                        attachments={attachments}
                      ></SupportingAttachment>
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
                  <div>
                    <div className="flex rounded-md items-center pr-2 pl-4 py-2 last:border-0 hover:bg-outline-200 max-h-[76px] max-w-[780px]">
                      <Link className="grow" href="./">
                        <span className="font-medium text-sm text-black-700 line-clamp-1 ">
                          question
                        </span>
                        <span className="mt-1 font-normal text-sm text-dim-500 line-clamp-1">
                          Answer:
                        </span>
                      </Link>
                      <span className="on hover:cursor-pointer pl-3">
                        <div className="flex">
                          <div className="pr-1.5">
                            <JataNegaraIcon className="stroke-[#E4E4E7] dark:stroke-[#27272A] h-5 w-5"></JataNegaraIcon>
                          </div>
                          <div className="font-normal text-sm text-black-800">
                            KBS
                          </div>
                          <div className="px-1">
                            <RightArrow />
                          </div>
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="font-semibold text-base text-black-700 pl-10 w-3/12">
            <RelatedTopics
              topics={topics}
              locale={locale}
              agencyId={agencyId}
            />
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default QuestionDetailPage;
