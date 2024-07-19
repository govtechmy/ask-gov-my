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
  agencyAcronym?: string;
}

const TopicList: React.FC<TopicListProps> = ({
  topics,
  locale,
  selectedTopicId,
  agencyAcronym,
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

  const isBasePath = currentPath === `/${agencyAcronym}`;

  return (
    <div className="max-h-[490px] min-w-[350px] overflow-auto ">
      <div className="px-4 pb-4 pt-0">
        <ul className="">
          <li>
            <a href={`/${agencyAcronym}`}>
              <div
                className={`flex h-10 items-center font-normal rounded-lg  py-2 px-3 mb-2 hover:cursor-pointer 
                  ${isBasePath ? 'bg-askmygovbrand-50 text-askmygovtextbrand-600' : 'bg-inherit text-black-800'} `}
              >
                {t('alltopics')}
              </div>
            </a>
          </li>
          {topics.map(topic => (
            <div
              key={topic.id}
              className={`items-center h-10 line-clamp-1 rounded-lg py-2 px-3 mb-2 font-normal ${selectedTopicId === topic.id ? 'bg-askmygovbrand-50 text-askmygovtextbrand-600' : 'text-black-800'}`}
            >
              <a
                href={constructHref(topic.id)}
                className={`hover:text-askmygovtextbrand-600 hover:cursor-pointer line-clamp-1`}
              >
                {locale === 'ms' ? topic.title_ms : topic.title}&nbsp;
              </a>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopicList;
