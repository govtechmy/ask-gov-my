'use client';

import { Link } from '@/lib/i18n';
import { useTranslations } from 'next-intl';
import { AGENCY_TO_UUID } from '@/lib/agency';

interface Question {
  id: number;
  question: string;
  date: string;
  state: string;
  agency: number;
  answer: string;
  topics: number[];
  email: string;
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

  const agencyAcronym = Object.keys(AGENCY_TO_UUID).find(
    key => AGENCY_TO_UUID[key] === question.agency.toString(),
  );

  return (
    <Link
      className="cursor-pointer items-center rounded-md border p-4 shadow-sm"
      href={`/${agencyAcronym?.toLowerCase()}/${question.id}`}
    >
      <h2 className="text-lg font-semibold">{question.question}</h2>
      <div
        className="mt-2 text-sm"
        dangerouslySetInnerHTML={{
          __html: truncateDescription(question.answer, 30),
        }}
      />
      <div className="mt-4 flex items-center">
        <span className="text-gray-600">{t(agencyAcronym)}</span>
        <span className="ml-auto text-xs text-gray-400">
          {new Date(question.date).toLocaleDateString('en-GB')}
        </span>
      </div>
    </Link>
  );
};

export default QuestionCard;
