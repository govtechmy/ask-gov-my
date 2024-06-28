'use client';

import { Link } from '@/lib/i18n';
import { useTranslations } from 'next-intl';

interface Question {
  id: string;
  name: string;
  description_html: string;
  agency: string;
  createdAt: string;
  agencyId: string;
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

  return (
    <Link
      className="cursor-pointer items-center rounded-md border p-4 shadow-sm"
      href={`${question.agency.toLowerCase()}/${question.id}`}
    >
      <h2 className="text-lg font-semibold">{question.name}</h2>
      <div
        className="mt-2 text-sm"
        dangerouslySetInnerHTML={{
          __html: truncateDescription(question.description_html, 30),
        }}
      />
      <div className="mt-4 flex items-center">
        <span className="text-gray-600">{t(question.agency)}</span>
        <span className="ml-auto text-xs text-gray-400">
          {new Date(question.createdAt).toLocaleDateString('en-GB')}
        </span>
      </div>
    </Link>
  );
};

export default QuestionCard;
