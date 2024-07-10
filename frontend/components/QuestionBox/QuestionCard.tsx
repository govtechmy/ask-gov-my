'use client';

import { Link } from '@/lib/i18n';
import { useTranslations } from 'next-intl';
import { AGENCY_TO_UUID } from '@/lib/agency';
import IconQuestionSmile from '@/icons/iconquestionsmile';
import JataNegaraIcon from '@/icons/jatanegaraicon';
import DateComponent from '../date';
import LikeIcon from '@/icons/likeicon';

interface Question {
  id: number;
  question: string;
  date: string;
  state: string;
  agency: number | { id: number };
  answer: string;
  topics: number[];
  email: string;
  likes: number;
}

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const t = useTranslations('Agency');

  const truncateDescription = (description: string, maxWords: number) => {
    const words = description.replace(/<\/?[^>]+(>|$)/g, '').split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return description;
  };

  const agencyId =
    typeof question.agency === 'object' ? question.agency.id : question.agency;
  const agencyAcronym = Object.keys(AGENCY_TO_UUID).find(
    key => AGENCY_TO_UUID[key] === agencyId.toString(),
  );

  return (
    <Link
      className="cursor-pointer bg-white items-center rounded-md border p-4 shadow-sm"
      href={`/${agencyAcronym?.toLowerCase()}/${question.id}`}
    >
      <div className="flex">
        <div className="pr-4">
          <IconQuestionSmile />
        </div>
        <div className="text-base font-medium text-brand-600">
          {question.question}
        </div>
      </div>

      <div className="mt-2 flex items-center">
        <span>
          <div className="flex items-center font-medium text-sm">
            <div className="pr-4">
              <JataNegaraIcon className="w-6 h-6 stroke-[#E4E4E7] dark:stroke-[#27272A]" />
            </div>
            <div className="text-black-800">{t(agencyAcronym)}</div>
            <div className="px-1 text-black-700">({agencyAcronym})</div>
            <div className="font-normal text-sm text-dim-500">
              <DateComponent date={question.date} />
            </div>
          </div>
        </span>
      </div>

      <div
        className="mt-2 ml-10 font-normal text-black-700"
        style={{ fontSize: '14px', lineHeight: '22px' }}
      >
        {truncateDescription(question.answer, 30)}
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
