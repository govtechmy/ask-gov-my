import { getAgencyList } from "@/actions/public/agency";
import { searchQuestions, getQuestionById } from "@/actions/public/question";
import { getAllTopics } from "@/actions/public/topic";
import ThumbsCounter from "@/app/[locale]/[agencyAcronym]/[questionId]/thumb-counters";
import AgencyName from "@/components/common/AgencyName";
import { notFound } from "next/navigation";
import { Link } from "@/lib/i18n";
import { Question, Topic } from "@/types/types";
import AgencyLogoImporter from "@/components/common/AgencyLogoImporter";
import TipTap from "@/components/Editor/TipTap";
import { FSP, inject } from "@/lib/decorator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
  Separator,
  AttachmentIcon,
  StyledDisplay,
  QuestionSmileSoloIcon,
  JataNegaraIcon,
} from "@askgovmy/ui";
import { route, routes } from "@/lib/routes";
import { since } from "@askgovmy/utils";
import mime from "mime-types";
import Translator from "@/components/client/translator";

interface QuestionDetailsProps {
  question: Question;
  relatedQuestions: Question[];
  relatedTopics: Topic[];
}

const QuestionDetailPage: FSP<QuestionDetailsProps> = async ({
  params,
  data,
}) => {
  const { question: question, relatedQuestions, relatedTopics } = data!;
  const answer = question.answer!;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb className="print:hidden">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={routes.home}>
                <Translator namespace="Questiondetail.home" tag="none" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage> {question.agency.acronym}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-3">
          <QuestionSmileSoloIcon />
          <div className="flex text-black-700 text-base font-medium">
            <Translator namespace="Questiondetail.posted" tag="none" />
            &nbsp;
            {since(question.created_at, params?.locale)}
          </div>
        </div>
      </div>

      <h3 className="text-mydstextbrand-600 font-medium text-2xl">
        {question.question}
      </h3>

      <div className="bg-white rounded-xl border border-outline-200 p-4.5 lg:p-8 gap-4.5 flex flex-col">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 lg:items-center">
          <div className="flex lg:items-center">
            <div className="flex w-6 h-6 relative flex-shrink-0">
              <AgencyLogoImporter currentAgency={question.agency} />
            </div>
            <div className="font-medium text-sm text-black-700 px-2">
              <Link
                className="hover:underline"
                href={route("agencyAllTopics", {
                  agencyAcronym: question.agency.acronym.toLowerCase(),
                })}
              >
                <AgencyName agency={question.agency} />
              </Link>
            </div>
          </div>
          <p className="font-medium text-sm text-dim-500 flex items-center gap-1">
            <Translator namespace="Questiondetail.answered" tag="span" />
            {since(answer.created_at, params?.locale)}
          </p>
        </div>
        <div className="flex text-justify text-black-700 flex-col">
          <TipTap
            editorText={answer.raw}
            className="w-full flex-1"
            isEditable={false}
            hasMenuBar={false}
          />
        </div>

        {relatedTopics.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-3 lg:items-start">
            <p className="font-medium text-sm">Topics: </p>
            <div className="flex flex-col lg:flex-row gap-1.5 flex-wrap">
              {relatedTopics.map((topic, index) => (
                <StyledDisplay key={index} variant={"Topics"}>
                  {topic.title}
                </StyledDisplay>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-1.5" />

        <div className="">
          <Translator
            namespace="Questiondetail.attachment"
            className="flex text-sm text-black-700 mb-3 font-medium"
          />
          <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
            {question.attachments.map((attachment) => (
              <a
                href={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${attachment.file_key}`}
                download={attachment.file_key.split("/").at(-1)}
                target="_blank"
                key={attachment.id}
              >
                <div className="bg-white border border-outline-200 rounded-lg max-w-[200px] flex items-center p-2 gap-3 md:w-[200px]">
                  <div>
                    <AttachmentIcon
                      type={
                        mime.lookup(attachment.file_key) ||
                        "application/octet-stream"
                      }
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-black-900 text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                      {attachment.file_key.split("/").at(-1)}
                    </p>
                    <p className="text-dim-500 text-xs">
                      {attachment.file_size < 1e6
                        ? `${(attachment.file_size / 1e3).toFixed(1)} KB`
                        : `${(attachment.file_size / 1e6).toFixed(1)} MB`}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <Separator className="my-1.5 w-[calc(100%+4rem)] -mx-8" />

        <ThumbsCounter
          answerId={answer.id}
          questionId={question.id.toString()}
          totalLikes={answer.likes}
        />
      </div>

      <div>
        <h6 className="font-semibold text-base pt-6 pb-2">Related questions</h6>
        <div className="w-full">
          {relatedQuestions.map((relatedQuestion, index) => (
            <Link
              href={`/${relatedQuestion.agency.acronym.toLowerCase()}/${relatedQuestion.id}`}
              key={relatedQuestion.id}
              className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-0 py-4 border-b border-outline-200 hover:rounded-md hover:bg-outline-200 px-4 -mx-4 lg:max-h-[76px]"
            >
              <div className="flex flex-col gap-1 flex-1">
                <span className="font-medium text-sm text-black-700 line-clamp-1">
                  {relatedQuestion.question}
                </span>
                <span className="font-normal text-sm text-dim-500 line-clamp-1">
                  Answer: {relatedQuestion.answer?.text}
                </span>
              </div>

              <div className="lg:pl-3">
                <div className="flex">
                  <div className="pr-1.5">
                    {/* TODO: Use agency icons instead */}
                    <JataNegaraIcon className="stroke-[#E4E4E7] dark:stroke-[#27272A] h-5 w-5" />
                  </div>
                  <div className="font-normal text-sm text-black-800">
                    {relatedQuestion.agency.acronym}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default inject(QuestionDetailPage, {
  // debug: true,
  async data({ params }) {
    const { data: agencies } = await getAgencyList();

    if (!agencies) {
      return notFound();
    }

    const agencyId = agencies.find(
      (agency) => agency.acronym.toLowerCase() === params.agencyAcronym
    )?.id;

    if (!agencyId) {
      return notFound();
    }

    const { data: question, status } = await getQuestionById(
      { questionId: params.questionId },
      params
    );

    if (status === 404) {
      return notFound();
    }

    if (question) {
      const [relatedQuestions, relatedTopics] = await Promise.all([
        searchQuestions(
          { query: question.question, page: 1, limit: 4 },
          params
        ),
        getAllTopics({ agencyId }, params),
      ]);
      return {
        question,
        relatedQuestions: relatedQuestions.data
          ? relatedQuestions.data.results
          : [],
        relatedTopics: relatedTopics.data?.filter((topic) =>
          question.topics.includes(topic.id)
        ),
      };
    }
  },
});
