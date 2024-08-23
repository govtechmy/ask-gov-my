'use client';

import { useSearchParams } from 'next/navigation';
import { Link } from '@/lib/i18n';
import IconQuestionSmile from '@/icons/iconquestionsmile';
import DateComponent from '../Date';
import LikeIcon from '@/icons/likeicon';
import AgencyLogoImporter from '../AgencyLogoImporter';
import { Agency, Question } from '@/types/types';
import AgencyName from '../AgencyName';

interface QuestionCardProps {
  question: Question;
  agencyMap: Record<string, string>;
  agencyList: Agency[];
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  agencyMap,
  agencyList,
}) => {
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || '';
  const agencyId =
    typeof question.agency === 'object' ? question.agency.id : question.agency;

  const agencyAcronym = Object.keys(agencyMap).find(
    key => agencyMap[key] === agencyId?.toString(),
  );

  const currentAgency = agencyList.find(agency => agency.id === agencyId);

  return (
    <Link
      className="cursor-pointer bg-white items-center rounded-md border p-5 shadow-sm"
      href={`/${agencyAcronym?.toLowerCase()}/${question.id}`}
    >
      <div className="flex">
        <div className="pr-4">
          <IconQuestionSmile />
        </div>
        <div className="text-base font-medium text-mydstextbrand-600">
          {question.question}
        </div>
      </div>

      <div className="mt-2 flex items-center">
        <span>
          <div className="flex items-center font-medium text-sm">
            <div className="pr-4">
              <div className="w-6 h-6 flex relative flex-shrink-0">
                {currentAgency && (
                  <AgencyLogoImporter currentAgency={currentAgency} />
                )}
              </div>
            </div>
            {currentAgency && <AgencyName agency={currentAgency} />}
            <div className="font-normal text-sm text-dim-500">
              &nbsp;
              <DateComponent date={question.date} locale={locale} />
            </div>
          </div>
        </span>
      </div>

      <div
        className="mt-2 ml-10 font-normal text-black-700 text-justify line-clamp-2 max-w-[900px]"
        style={{ fontSize: '14px', lineHeight: '22px' }}
      >
        {question.answer_preview}
      </div>
      <div className="mt-3 ml-10 flex items-center">
        <div className="mr-2">
          <LikeIcon />
        </div>
        <div className="mr-1 font-semibold text-sm text-dim-500">
          {question.likes}
        </div>
        <div className="font-normal text-sm text-dim-500">
          people found this useful
        </div>
      </div>
    </Link>
  );
};

export default QuestionCard;
