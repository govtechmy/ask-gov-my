'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Topic {
  id: number;
  title: string;
  title_ms?: string;
}

interface TopicListProps {
  topics: Topic[];
  locale: string;
  selectedTopicId?: number;
  agencyId?: string;
}

const TopicList: React.FC<TopicListProps> = ({
  topics,
  locale,
  selectedTopicId,
  agencyId,
}) => {
  const t = useTranslations('Topics');
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const constructHref = (topicId: number) => {
    return currentPath.includes('/topics/')
      ? currentPath.replace(/\/topics\/\d+$/, `/topics/${topicId}`)
      : `${currentPath}/topics/${topicId}`;
  };

  return (
    <div className="pt-6">
      <div className="p-4">
        <ul>
          <li>
            <a href={`/${agencyId}`}>
              <div className="flex h-10 w-[324px] bg-[#F4EFFF] items-center font-normal rounded-lg text-[#702FF9] py-2 px-3 mb-2 hover:cursor-pointer">
                {t('alltopics')}
              </div>
            </a>
          </li>
          {topics.map(topic => (
            <li
              key={topic.id}
              className={`items-center h-10 w-[324px] rounded-lg py-2 px-3 mb-2 font-normal ${selectedTopicId === topic.id ? 'bg-[#F4EFFF]' : ''}`}
            >
              <a
                href={constructHref(topic.id)}
                className={` truncate text-black-800 hover:text-[#702FF9] hover:cursor-pointer`}
              >
                {locale === 'ms' ? topic.title_ms : topic.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopicList;
