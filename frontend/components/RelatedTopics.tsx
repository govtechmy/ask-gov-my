'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface Topic {
  id: number;
  title: string;
  title_ms?: string;
}

interface RelatedTopicsProps {
  topics: Topic[];
  locale: string;
  agencyId: string;
}

const RelatedTopics: React.FC<RelatedTopicsProps> = ({
  topics,
  locale,
  agencyId,
}) => {
  const t = useTranslations('Topics');

  return (
    <div className="pt-4">
      <ul className="flex flex-col justify-between h-full">
        <li className="py-2">
          <div className="flex items-center ">
            <div className="text-base font-normal text-black-800 hover:cursor-pointer hover:text-[#702FF9] dark:hover:text-[#9E70FF] ">
              <div className="font-semibold text-base text-black-700">
                {t('relatedtopics')}
              </div>
              <Link href={`/${agencyId}`}>{t('alltopics')}</Link>
            </div>
          </div>
        </li>
        {topics.map(topic => (
          <li key={topic.id} className="py-2">
            <div className="flex items-center ">
              <Link href={`/${agencyId}/topics/${topic.id}`}>
                <div className="text-base font-normal text-black-800 hover:cursor-pointer hover:text-[#702FF9] dark:hover:text-[#9E70FF] ">
                  {locale === 'ms' ? topic.title_ms : topic.title}
                </div>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedTopics;
