'use client';

import { Link } from '@/lib/i18n';
import { useTranslations } from 'next-intl';
import { AGENCY_TO_UUID } from '@/lib/agency';
import IconQuestionSmile from '@/icons/iconquestionsmile';
import DateComponent from '../date';
import LikeIcon from '@/icons/likeicon';
import AgencyLogoImporter from '../AgencyLogoImporter';

interface Question {
  id: number;
  question: string;
  date: string;
  answered_date: string;
  state: string;
  agency: number;
  answer: string;
  topics: number[];
  email?: string;
  likes: number;
  dislikes: number;
  attachments?: string[];
  admin_isopen?: boolean;
  staff_isopen?: boolean;
}

interface QuestionCardProps {
  question: Question;
  trendingAgencies: any[];
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  trendingAgencies,
}) => {
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

  const findTrendingAgency = (acronym: string | undefined, agencies: any[]) => {
    return agencies.find(agency => agency.acronym === acronym);
  };

  const trendingAgency = findTrendingAgency(agencyAcronym, trendingAgencies);

  console.log(trendingAgency);
  console.log(' THIS IS THE NESXT');

  return (
    <Link
      className="cursor-pointer bg-white items-center rounded-md border p-4 shadow-sm"
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
              <div className="w-6 h-6 flex">
                <AgencyLogoImporter
                  currentAgency={trendingAgency}
                ></AgencyLogoImporter>
              </div>
            </div>
            <div className="text-black-800">{t(agencyAcronym)}</div>
            <div className="px-1 text-black-700">({agencyAcronym})</div>
            <div className="font-normal text-sm text-dim-500">
              <DateComponent date={question.date} locale={''} />
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
