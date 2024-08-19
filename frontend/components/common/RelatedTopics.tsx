'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Topic } from '@/types/types';

interface RelatedTopicsProps {
  topics: Topic[];
  locale: string;
  agencyAcronym: string;
}

const RelatedTopics: React.FC<RelatedTopicsProps> = ({
  topics,
  locale,
  agencyAcronym,
}) => {
  const t = useTranslations('Topics');

  return (
    <div className="max-h-[540px] min-w-[300px]">
      <div className="font-semibold text-base text-black-700 pb-6">
        {t('relatedtopics')}
      </div>

      <div className="flex py-2 pb-4 items-center h-10 text-base font-normal text-black-800 hover:cursor-pointer hover:text-[#702FF9] dark:hover:text-[#9E70FF]">
        <Link href={`/${agencyAcronym}`}>{t('alltopics')}</Link>
      </div>

      {topics.map(topic => (
        <div key={topic.id} className="py-1 ">
          <div className="flex items-center">
            <Link
              href={`/${agencyAcronym}/topics/${topic.id}`}
              className="w-full "
            >
              <div className="h-10 text-base max-w-[290px] font-normal text-black-800 hover:cursor-pointer hover:text-[#702FF9] dark:hover:text-[#9E70FF] flex items-center overflow-hidden whitespace-nowrap">
                <span className="truncate">
                  {locale === 'ms' ? topic.title_ms : topic.title}
                </span>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RelatedTopics;
